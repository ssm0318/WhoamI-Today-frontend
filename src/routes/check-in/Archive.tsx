import { ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '@components/_common/loader/Loader';
import MainContainer from '@components/_common/main-container/MainContainer';
import NoContents from '@components/_common/no-contents/NoContents';
import ArchiveDateSection from '@components/check-in/archive/ArchiveDateSection';
import ArchiveEntryMoreModal from '@components/check-in/archive/ArchiveEntryMoreModal';
import ModifyVisibilityModal from '@components/check-in/archive/ModifyVisibilityModal';
import ThoughtFullTextModal from '@components/check-in/archive/ThoughtFullTextModal';
import SubHeader from '@components/sub-header/SubHeader';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Colors, Layout, Typo } from '@design-system';
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

  const [tab, setTab] = useState<ArchiveTab>('all');
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
  };

  const handleMoreClick = (entry: CheckInComponentEntry) => {
    setMoreEntry(entry);
  };

  const handleModifyVisibility = (entry: CheckInComponentEntry) => {
    setVisibilityEntry(entry);
  };

  const handleConfirmVisibility = async (visibility: ComponentVisibility) => {
    if (!visibilityEntry) return;
    try {
      const updated = await updatePinVisibility(visibilityEntry.id, visibility);
      await mutate((pages) => patchEntryInPages(pages, updated), { revalidate: false });
      openToast({ message: t('visibility_modal.updated_toast') });
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
    } catch {
      openToast({ message: tDelete('error') });
    }
  };

  return (
    <MainContainer>
      <SubHeader title={t('title')} />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT} w="100%" ph={DEFAULT_MARGIN}>
        {/* Segmented control — styled per the 8px chip rules */}
        <Layout.FlexRow w="100%" mt={12} mb={14} gap={6}>
          <SegmentButton active={tab === 'all'} onClick={() => setTab('all')}>
            {t('segmented.all')} ({archivedCount})
          </SegmentButton>
          <SegmentButton active={tab === 'pinned'} onClick={() => setTab('pinned')}>
            {t('segmented.pinned')} ({pinnedCount})
          </SegmentButton>
        </Layout.FlexRow>

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
    </MainContainer>
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
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        borderRadius: 8,
        padding: '4px 8px',
        fontSize: 14,
        lineHeight: 1.4,
        fontWeight: active ? 600 : 400,
        border: `1px solid ${active ? Colors.PRIMARY : '#D9D9D9'}`,
        background: active ? '#F3E8FF' : Colors.WHITE,
        color: active ? Colors.PRIMARY : Colors.DARK_GRAY,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}
