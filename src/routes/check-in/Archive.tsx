import { ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '@components/_common/loader/Loader';
import MainContainer from '@components/_common/main-container/MainContainer';
import NoContents from '@components/_common/no-contents/NoContents';
import ArchiveDateSection from '@components/check-in/archive/ArchiveDateSection';
import ThoughtFullTextModal from '@components/check-in/archive/ThoughtFullTextModal';
import SubHeader from '@components/sub-header/SubHeader';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Colors, Layout, Typo } from '@design-system';
import { useSWRInfiniteCursor } from '@hooks/useSWRInfiniteCursor';
import { ArchiveTab, CheckInComponentEntry, ComponentType } from '@models/checkInEntry';
import { archiveEntriesFetcher, ArchiveEntriesResponse } from '@utils/apis/archive';
import { groupEntriesByDate } from '@utils/archiveHelpers';

/**
 * Owner archive feed — two-column grid of square cards grouped by date,
 * newest first. The `All | Pinned (N)` segmented control toggles between
 * the full archive and the curated pinned subset.
 *
 * This branch replaces the placeholder JSON render with the real card
 * renderers (battery / mood / thought / song) and wires up the thought
 * full-text modal. Pin + ⋯ actions remain visual only — click handlers
 * that hit the pin/pin_visibility/delete endpoints land in the next
 * stacked branch feat/archive-entry-actions.
 */
function Archive() {
  const [t] = useTranslation('translation', { keyPrefix: 'archive' });
  const [tab, setTab] = useState<ArchiveTab>('all');
  const [thoughtModalEntry, setThoughtModalEntry] = useState<CheckInComponentEntry | null>(null);

  const baseKey = `/check_in/entries/${tab === 'pinned' ? '?tab=pinned' : ''}`;

  const { data, isLoading, isLoadingMore, targetRef, isEndPage } = useSWRInfiniteCursor<
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
  // fresh as entries are pinned/unpinned/deleted in other branches.
  const latest = data?.[data.length - 1];
  const archivedCount = latest?.archived_count ?? 0;
  const pinnedCount = latest?.pinned_count ?? 0;

  const handleBodyClick = (entry: CheckInComponentEntry) => {
    // Song bottom-sheet + battery/mood full-size popup wiring lands in
    // feat/archive-entry-actions; for now only the thought modal opens.
    if (entry.component === ComponentType.THOUGHT) {
      setThoughtModalEntry(entry);
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
    </MainContainer>
  );
}

export default Archive;

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
