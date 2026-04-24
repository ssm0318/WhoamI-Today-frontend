import { ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '@components/_common/loader/Loader';
import MainContainer from '@components/_common/main-container/MainContainer';
import NoContents from '@components/_common/no-contents/NoContents';
import SubHeader from '@components/sub-header/SubHeader';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Colors, Layout, Typo } from '@design-system';
import { useSWRInfiniteCursor } from '@hooks/useSWRInfiniteCursor';
import { ArchiveTab, CheckInComponentEntry } from '@models/checkInEntry';
import { archiveEntriesFetcher, ArchiveEntriesResponse } from '@utils/apis/archive';

/**
 * Owner archive feed — two-column grid of square cards grouped by date,
 * newest first. The `All | Pinned (N)` segmented control toggles between
 * the full archive and the curated pinned subset.
 *
 * This branch lands the screen skeleton: header, segmented control,
 * infinite-scroll wiring, empty/loading states, and a placeholder card
 * render that prints the raw entry so the data round-trip is visible.
 * The polished per-component card renderers (mood 2-col, song pill,
 * thought popup, battery emoji) land in the next stacked branch
 * feat/archive-card-renderers.
 */
function Archive() {
  const [t] = useTranslation('translation', { keyPrefix: 'archive' });
  const [tab, setTab] = useState<ArchiveTab>('all');

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

  // Counts come back on every page; pull from the latest page so they stay
  // fresh as entries are pinned/unpinned/deleted in other branches.
  const latest = data?.[data.length - 1];
  const archivedCount = latest?.archived_count ?? 0;
  const pinnedCount = latest?.pinned_count ?? 0;

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

        {/* Placeholder render — feat/archive-card-renderers replaces this with
            the 2-col square-card grid grouped by date. */}
        <Layout.FlexCol w="100%" gap={8} mb={80}>
          {flat.map((entry) => (
            <PlaceholderCard key={entry.id} entry={entry} />
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

function PlaceholderCard({ entry }: { entry: CheckInComponentEntry }) {
  return (
    <div
      style={{
        border: '1px solid #D9D9D9',
        borderRadius: 8,
        padding: 8,
        background: Colors.WHITE,
      }}
    >
      <Typo type="label-medium" color="MEDIUM_GRAY">
        #{entry.id} · {entry.component} · {new Date(entry.created_at).toLocaleString()}
      </Typo>
      <Typo type="body-medium" color="DARK">
        {JSON.stringify(entry.data)}
      </Typo>
      <Typo type="label-small" color="DARK_GRAY">
        vis={entry.visibility}
        {entry.is_pinned ? ` · pinned (${entry.pin_visibility})` : ''}
      </Typo>
    </div>
  );
}
