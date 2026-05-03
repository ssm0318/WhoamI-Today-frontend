import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { mutate as globalMutate } from 'swr';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import ArchiveDateSection from '@components/check-in/archive/ArchiveDateSection';
import ArchiveEntryMoreModal from '@components/check-in/archive/ArchiveEntryMoreModal';
import ModifyVisibilityModal from '@components/check-in/archive/ModifyVisibilityModal';
import PinConfirmModal from '@components/check-in/archive/PinConfirmModal';
import ThoughtFullTextModal from '@components/check-in/archive/ThoughtFullTextModal';
import SubHeader from '@components/sub-header/SubHeader';
import { DEFAULT_MARGIN } from '@constants/layout';
import { Colors, Layout, SvgIcon, Typo } from '@design-system';
import { useSWRInfiniteCursor } from '@hooks/useSWRInfiniteCursor';
import { ComponentVisibility } from '@models/checkIn';
import { CheckInComponentEntry, ComponentType } from '@models/checkInEntry';
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

type HistoryTab = 'all' | 'pinned';

/**
 * Owner history feed — two-column grid of square cards grouped by date,
 * newest first. The `History | Pinned (N)` segmented control toggles
 * between the full history and the curated pinned subset.
 */
function History() {
  const [t] = useTranslation('translation', { keyPrefix: 'history' });
  const [tPin] = useTranslation('translation', { keyPrefix: 'history.pin' });
  const [tDelete] = useTranslation('translation', { keyPrefix: 'history.delete_confirm' });

  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));

  const [searchParams] = useSearchParams();
  const initialTab: HistoryTab = searchParams.get('tab') === 'pinned' ? 'pinned' : 'all';
  const [tab, setTab] = useState<HistoryTab>(initialTab);
  const [thoughtModalEntry, setThoughtModalEntry] = useState<CheckInComponentEntry | null>(null);
  const [moreEntry, setMoreEntry] = useState<CheckInComponentEntry | null>(null);
  const [visibilityEntry, setVisibilityEntry] = useState<CheckInComponentEntry | null>(null);
  const [pinConfirmEntry, setPinConfirmEntry] = useState<CheckInComponentEntry | null>(null);

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

  const latest = data?.[data.length - 1];
  const historyCount = latest?.history_count ?? latest?.archived_count ?? 0;
  const pinnedCount = latest?.pinned_count ?? 0;

  const handleBodyClick = (entry: CheckInComponentEntry) => {
    if (entry.component === ComponentType.THOUGHT) {
      setThoughtModalEntry(entry);
    }
  };

  const invalidateSiblingCaches = useCallback(() => {
    globalMutate('/check_in/entries/');
  }, []);

  /**
   * Pin click — when pinning, show the PinConfirmModal so the user
   * can confirm or change visibility. Unpinning is immediate.
   */
  const handlePinClick = (entry: CheckInComponentEntry) => {
    if (entry.is_pinned) {
      // Unpin: direct toggle, no modal needed
      handleUnpin(entry);
    } else {
      // Pin: show confirmation modal
      setPinConfirmEntry(entry);
    }
  };

  const handleUnpin = async (entry: CheckInComponentEntry) => {
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
            is_pinned: false,
            pin_visibility: null,
          }),
        rollbackOnError: true,
        revalidate: true,
      },
    ).catch(() => {
      /* error already surfaced via toast */
    });

    openToast({ message: tPin('unpinned') });
    invalidateSiblingCaches();
  };

  const handlePinConfirm = async (
    entry: CheckInComponentEntry,
    visibility: ComponentVisibility,
  ) => {
    await mutate(
      async (pages) => {
        try {
          const updated = await togglePin(entry.id, visibility);
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
            is_pinned: true,
            pin_visibility: visibility,
          }),
        rollbackOnError: true,
        revalidate: true,
      },
    ).catch(() => {
      /* error already surfaced via toast */
    });

    openToast({ message: tPin('pinned') });
    invalidateSiblingCaches();
  };

  const handleMoreClick = (entry: CheckInComponentEntry) => {
    setMoreEntry(entry);
  };

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
        <Layout.FlexRow w="100%" mt={12} mb={14} gap={6}>
          <SegmentButton active={tab === 'pinned'} onClick={() => setTab('pinned')}>
            <SvgIcon name="pin_filled" size={14} color={tab === 'pinned' ? 'WHITE' : 'PRIMARY'} />
            {t('segmented.pinned')} ({pinnedCount})
          </SegmentButton>
          <SegmentButton active={tab === 'all'} onClick={() => setTab('all')}>
            <HistoryIcon active={tab === 'all'} />
            {t('segmented.all')} ({historyCount})
          </SegmentButton>
        </Layout.FlexRow>

        {tab === 'all' && (
          <Layout.FlexRow w="100%" mb={12}>
            <Typo type="body-small" color="DARK_GRAY">
              {t('history_hint')}
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

      <PinConfirmModal
        entry={pinConfirmEntry}
        onClose={() => setPinConfirmEntry(null)}
        onConfirm={handlePinConfirm}
      />
    </MainScrollContainer>
  );
}

export default History;

// ---- helpers ----

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

// ---- local UI primitives ----

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

function HistoryIcon({ active }: { active: boolean }) {
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
