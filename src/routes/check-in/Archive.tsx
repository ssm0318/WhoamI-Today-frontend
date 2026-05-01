import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { mutate as globalMutate } from 'swr';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import ArchiveDateSection from '@components/check-in/archive/ArchiveDateSection';
import ArchiveEntryMoreModal from '@components/check-in/archive/ArchiveEntryMoreModal';
import ModifyVisibilityModal from '@components/check-in/archive/ModifyVisibilityModal';
import ThoughtFullTextModal from '@components/check-in/archive/ThoughtFullTextModal';
import SubHeader from '@components/sub-header/SubHeader';
import { DEFAULT_MARGIN } from '@constants/layout';
import { Colors, Layout, SvgIcon, Typo } from '@design-system';
import { useSWRInfiniteCursor } from '@hooks/useSWRInfiniteCursor';
import { ComponentVisibility } from '@models/checkIn';
import { ArchiveTab, CheckInComponentEntry, ComponentType } from '@models/checkInEntry';
import { useBoundStore } from '@stores/useBoundStore';
import {
  archiveEntriesFetcher,
  ArchiveEntriesResponse,
  deleteArchiveEntry,
  togglePin,
  updatePinVisibility,
} from '@utils/apis/archive';
import { groupEntriesByDate } from '@utils/archiveHelpers';
import { MainScrollContainer } from '../Root';

/**
 * Owner archive feed — two-column grid of square cards grouped by date,
 * newest first. The `All | Pinned (N)` segmented control toggles between
 * the full archive and the curated pinned subset.
 *
 * This branch wires up the per-card actions: pin toggle (optimistic +
 * SWR revalidate), `⋯` bottom menu with Modify visibility + Delete (the
 * latter gated behind a CommonDialog confirmation), and the visibility-
 * edit modal for pinned entries. Modify visibility is only offered for
 * pinned rows — unpinned archived entries have no audience beyond the
 * owner, so there's nothing to modify until they're pinned.
 */
function Archive() {
  const [t] = useTranslation('translation', { keyPrefix: 'archive' });
  const [tPin] = useTranslation('translation', { keyPrefix: 'archive.pin' });
  const [tDelete] = useTranslation('translation', { keyPrefix: 'archive.delete_confirm' });

  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));

  // Initial tab can be driven by `?tab=pinned` from the profile chip.
  // Unknown / missing values fall back to 'all' so the URL is forgiving.
  const [searchParams] = useSearchParams();
  const initialTab: ArchiveTab = searchParams.get('tab') === 'pinned' ? 'pinned' : 'all';
  const [tab, setTab] = useState<ArchiveTab>(initialTab);
  const [thoughtModalEntry, setThoughtModalEntry] = useState<CheckInComponentEntry | null>(null);
  const [moreEntry, setMoreEntry] = useState<CheckInComponentEntry | null>(null);
  const [visibilityEntry, setVisibilityEntry] = useState<CheckInComponentEntry | null>(null);

  const baseKey = `/check_in/entries/${tab === 'pinned' ? '?tab=pinned' : ''}`;

  const { data, isLoading, isLoadingMore, targetRef, isEndPage, mutate } = useSWRInfiniteCursor<
    CheckInComponentEntry,
    ArchiveEntriesResponse
  >({
    baseKey,
    fetcher: archiveEntriesFetcher,
  });

  const flat = useMemo<CheckInComponentEntry[]>(
    () => (data ? data.flatMap((page) => page.results ?? []) : []),
    [data],
  );

  const sections = useMemo(() => groupEntriesByDate(flat), [flat]);

  // Counts come back on every page; pull from the latest page so they stay
  // fresh as entries are pinned/unpinned/deleted.
  const latest = data?.[data.length - 1];
  const archivedCount = latest?.archived_count ?? 0;
  const pinnedCount = latest?.pinned_count ?? 0;

  const handleBodyClick = (entry: CheckInComponentEntry) => {
    // Song bottom-sheet + battery/mood full-size popup wiring remains a
    // polish step; for now only the thought modal opens.
    if (entry.component === ComponentType.THOUGHT) {
      setThoughtModalEntry(entry);
    }
  };

  /**
   * Revalidate sibling cache keys that don't share the infinite-scroll cache
   * with the current screen. Called after any successful mutation so the
   * profile's `[ All (N) | Pinned (M) ]` chip (useSWR on `/check_in/entries/`)
   * and the opposite tab's infinite cache refresh on next visit.
   *
   * Note: the archive's own `useSWRInfinite` cache is keyed separately from
   * `useSWR` with the same URL string, so the archive's local `mutate()`
   * cannot invalidate the profile chip's entry — we must fire a global
   * invalidation here.
   */
  const invalidateSiblingCaches = useCallback(() => {
    globalMutate('/check_in/entries/');
  }, []);

  /**
   * Optimistically flip the pin icon, revalidate, and roll back on error.
   * The `is_pinned` toggle is the most frequent archive interaction — the
   * user sees instant feedback even before the round-trip.
   */
  const handlePinClick = async (entry: CheckInComponentEntry) => {
    const nextPinned = !entry.is_pinned;

    await mutate(
      async (pages) => {
        try {
          const updated = await togglePin(entry.id);
          return patchEntryInPages(pages, updated);
        } catch (err) {
          openToast({ message: tPin('error') });
          throw err;
        }
      },
      {
        optimisticData: (pages) =>
          patchEntryInPages(pages, {
            ...entry,
            is_pinned: nextPinned,
            pin_visibility: nextPinned ? entry.visibility : null,
          }),
        rollbackOnError: true,
        revalidate: true,
      },
    ).catch(() => {
      /* error already surfaced via toast */
    });

    openToast({ message: nextPinned ? tPin('pinned') : tPin('unpinned') });
    invalidateSiblingCaches();
  };

  const handleMoreClick = (entry: CheckInComponentEntry) => {
    setMoreEntry(entry);
  };

  /**
   * Open the modify-visibility modal. The backend's PATCH
   * /entries/<pk>/pin_visibility/ only accepts already-pinned rows, so
   * when the user picks this action on an unpinned entry we auto-pin
   * it first (which server-side seeds pin_visibility from
   * entry.visibility) and then open the modal on the updated row.
   * Intent: the user is asking "who can see this?" — they shouldn't
   * need to think about whether the card is already pinned.
   */
  const handleModifyVisibility = async (entry: CheckInComponentEntry) => {
    if (entry.is_pinned) {
      setVisibilityEntry(entry);
      return;
    }
    try {
      const updated = await togglePin(entry.id);
      await mutate((pages) => patchEntryInPages(pages, updated), { revalidate: false });
      invalidateSiblingCaches();
      setVisibilityEntry(updated);
    } catch {
      openToast({ message: tPin('error') });
    }
  };

  const handleConfirmVisibility = async (visibility: ComponentVisibility) => {
    if (!visibilityEntry) return;
    try {
      const updated = await updatePinVisibility(visibilityEntry.id, visibility);
      await mutate((pages) => patchEntryInPages(pages, updated), { revalidate: false });
      openToast({ message: t('visibility_modal.updated_toast') });
      invalidateSiblingCaches();
    } catch {
      openToast({ message: t('visibility_modal.error') });
    }
    setVisibilityEntry(null);
  };

  const handleDelete = async (entry: CheckInComponentEntry) => {
    try {
      await deleteArchiveEntry(entry.id);
      await mutate();
      openToast({ message: tDelete('toast_deleted') });
      invalidateSiblingCaches();
    } catch {
      openToast({ message: tDelete('error') });
    }
  };

  return (
    <MainScrollContainer>
      <SubHeader title={t('title')} />
      <Layout.FlexCol w="100%" ph={DEFAULT_MARGIN}>
        {/* Segmented control — filled pill buttons that read as navigation
            distinct from the surrounding check-in content cards. All and
            Pinned share the same visual treatment; only the active state
            (purple fill) marks which tab is currently selected. */}
        <Layout.FlexRow w="100%" mt={12} mb={14} gap={6}>
          <SegmentButton active={tab === 'pinned'} onClick={() => setTab('pinned')}>
            <SvgIcon name="pin_filled" size={14} color={tab === 'pinned' ? 'WHITE' : 'PRIMARY'} />
            {t('segmented.pinned')} ({pinnedCount})
          </SegmentButton>
          <SegmentButton active={tab === 'all'} onClick={() => setTab('all')}>
            <ArchiveIcon active={tab === 'all'} />
            {t('segmented.all')} ({archivedCount})
          </SegmentButton>
        </Layout.FlexRow>

        {tab === 'all' && (
          <Layout.FlexRow w="100%" mb={12}>
            <Typo type="body-small" color="DARK_GRAY">
              {t('archived_hint')}
            </Typo>
          </Layout.FlexRow>
        )}

        <Layout.FlexCol w="100%" mb={80}>
          {sections.map((section) => (
            <ArchiveDateSection
              key={section.key}
              label={section.label}
              items={section.items}
              onPinClick={handlePinClick}
              onMoreClick={handleMoreClick}
              onBodyClick={handleBodyClick}
            />
          ))}
          <div ref={targetRef} />
          {(isLoading || isLoadingMore) && (
            <Layout.FlexRow w="100%" h={40}>
              <Loader />
            </Layout.FlexRow>
          )}
          {!isLoading && flat.length === 0 && (
            <NoContents text={tab === 'pinned' ? t('empty.pinned') : t('empty.all')} mv={20} />
          )}
          {isEndPage && flat.length > 0 && (
            <Layout.FlexRow w="100%" justifyContent="center" mt={8}>
              <Typo type="label-medium" color="MEDIUM_GRAY">
                {t('end_of_feed')}
              </Typo>
            </Layout.FlexRow>
          )}
        </Layout.FlexCol>
      </Layout.FlexCol>

      <ThoughtFullTextModal entry={thoughtModalEntry} onClose={() => setThoughtModalEntry(null)} />

      <ArchiveEntryMoreModal
        entry={moreEntry}
        onClose={() => setMoreEntry(null)}
        onModifyVisibility={handleModifyVisibility}
        onDelete={handleDelete}
      />

      <ModifyVisibilityModal
        entry={visibilityEntry}
        onClose={() => setVisibilityEntry(null)}
        onConfirm={handleConfirmVisibility}
      />
    </MainScrollContainer>
  );
}

export default Archive;

// ---- helpers ----

/**
 * Return a new pages array with the given entry patched in place.
 * Used by both the optimistic update and the server-response commit
 * so the SWR cache stays consistent without a full refetch on each
 * PATCH.
 */
function patchEntryInPages(
  pages: ArchiveEntriesResponse[] | undefined,
  patched: CheckInComponentEntry,
): ArchiveEntriesResponse[] {
  if (!pages) return [];
  return pages.map((page) => ({
    ...page,
    results: (page.results ?? []).map((e) => (e.id === patched.id ? patched : e)),
  }));
}

// ---- local UI primitives kept inline for this first screen pass ----

interface SegmentButtonProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

function SegmentButton({ active, onClick, children }: SegmentButtonProps) {
  // Ghost pill — subtle light-gray fill for the inactive state, near-black
  // fill for the active state. Distinct from the surrounding check-in
  // cards (which use the white-bg + gray-outline 8px-chip pattern), and
  // All and Pinned share the same tone; the active fill marks the
  // currently-selected tab.
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        borderRadius: 999,
        padding: '4px 12px',
        fontSize: 14,
        lineHeight: 1.4,
        fontWeight: active ? 600 : 500,
        border: 'none',
        background: active ? Colors.DARK : '#F5F5F5',
        color: active ? Colors.WHITE : Colors.PRIMARY,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

function ArchiveIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ color: active ? Colors.WHITE : Colors.PRIMARY }}
    >
      <rect x="3" y="3" width="18" height="5" rx="1" />
      <path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8" />
      <path d="M10 12h4" />
    </svg>
  );
}
