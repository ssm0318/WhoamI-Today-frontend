import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import ArchiveDateSection from '@components/check-in/archive/ArchiveDateSection';
import SubHeader from '@components/sub-header/SubHeader';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import { useSWRInfiniteCursor } from '@hooks/useSWRInfiniteCursor';
import { CheckInComponentEntry } from '@models/checkInEntry';
import { archiveEntriesFetcher, ArchiveEntriesResponse } from '@utils/apis/archive';
import { groupEntriesByDate } from '@utils/archiveHelpers';
import { scrollAndHighlight } from '@utils/scrollHelpers';
import { MainScrollContainer } from '../Root';

/**
 * Read-only pinned check-in feed for a friend.
 *
 * Reuses the same date-grouped 2-column grid + ArchiveCard renderers
 * as the owner archive, but passes no pin/⋯ handlers — those icons
 * remain present as visual state (the pin appears filled for items
 * the owner has pinned) without any click behavior, matching the
 * spec's "no reactions or edits on a friend's pinned feed."
 *
 * Route: /users/:username/check-in/pinned
 */
function FriendPinnedFeed() {
  const [t] = useTranslation('translation', { keyPrefix: 'history' });
  const [tPr] = useTranslation('translation', { keyPrefix: 'private_reply' });
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();

  const baseKey = username ? `/user/${username}/check_in/pinned/` : null;

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

  const highlightId = searchParams.get('highlight');
  const hasHighlightedRef = useRef(false);
  useEffect(() => {
    if (!highlightId || flat.length === 0 || hasHighlightedRef.current) return;
    hasHighlightedRef.current = true;
    requestAnimationFrame(() => scrollAndHighlight(`entry-${highlightId}`));
  }, [flat, highlightId]);

  const title = username
    ? t('friend_feed.title_with_username', { username })
    : t('friend_feed.title');

  return (
    <MainScrollContainer>
      <SubHeader title={title} />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT} w="100%" ph={DEFAULT_MARGIN} mb={80}>
        {username && (
          <Layout.FlexRow w="100%" pv={10} mb={4}>
            <Typo type="label-medium" color="MEDIUM_GRAY">
              {tPr('friend_page_hint', { username })}
            </Typo>
          </Layout.FlexRow>
        )}
        {sections.map((section) => (
          <ArchiveDateSection
            key={section.key}
            label={section.label}
            items={section.items}
            friendUsername={username}
          />
        ))}
        <div ref={targetRef} />
        {(isLoading || isLoadingMore) && (
          <Layout.FlexRow w="100%" h={40}>
            <Loader />
          </Layout.FlexRow>
        )}
        {!isLoading && flat.length === 0 && <NoContents text={t('friend_feed.empty')} mv={20} />}
        {isEndPage && flat.length > 0 && (
          <Layout.FlexRow w="100%" justifyContent="center" mt={8}>
            <Typo type="label-medium" color="MEDIUM_GRAY">
              {t('end_of_feed')}
            </Typo>
          </Layout.FlexRow>
        )}
      </Layout.FlexCol>
    </MainScrollContainer>
  );
}

export default FriendPinnedFeed;
