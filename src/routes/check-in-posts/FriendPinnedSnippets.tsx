import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import CheckInPostItem from '@components/check-in-posts/CheckInPostItem/CheckInPostItem';
import CheckInPostViewer from '@components/check-in-posts/CheckInPostViewer';
import SubHeader from '@components/sub-header/SubHeader';
import { Layout, Typo } from '@design-system';
import { CheckInPostStory } from '@models/checkInPost';
import { getUserCheckInPosts } from '@utils/apis/checkInPost';
import { getUserProfile } from '@utils/apis/user';
import { scrollAndHighlight } from '@utils/scrollHelpers';
import { MainScrollContainer } from '../Root';

function FriendPinnedSnippets() {
  const [t] = useTranslation('translation', { keyPrefix: 'check_in_post' });
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();

  const [snippets, setSnippets] = useState<CheckInPostStory[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!username) return;
    let cancelled = false;
    getUserProfile(username)
      .then((profile) => getUserCheckInPosts(profile.id))
      .then((data) => {
        if (!cancelled) setSnippets(data.results ?? []);
      })
      .catch(() => {
        if (!cancelled) setSnippets([]);
      });
    return () => {
      cancelled = true;
    };
  }, [username]);

  const pinned = useMemo(() => snippets.filter((s) => s.is_pinned), [snippets]);

  const highlightId = searchParams.get('highlight');
  const hasHighlightedRef = useRef(false);
  useEffect(() => {
    if (!highlightId || pinned.length === 0 || hasHighlightedRef.current) return;
    hasHighlightedRef.current = true;
    requestAnimationFrame(() => scrollAndHighlight(`post-${highlightId}`));
  }, [pinned, highlightId]);

  const handleClickCell = (story: CheckInPostStory) => () => {
    const idx = pinned.findIndex((s) => s.id === story.id);
    if (idx >= 0) setActiveIndex(idx);
  };

  const title = username ? t('friend_pinned_title', { username }) : t('archive.title_pinned');

  return (
    <MainScrollContainer>
      <SubHeader title={title} />
      <Layout.FlexCol w="100%" pv={12} ph={16} gap={12}>
        {pinned.length === 0 ? (
          <EmptyState>
            <Typo type="body-medium" color="MEDIUM_GRAY">
              {t('archive.empty_pinned')}
            </Typo>
          </EmptyState>
        ) : (
          <Layout.FlexCol w="100%" gap={12}>
            {pinned.map((story) => (
              <CheckInPostItem key={story.id} post={story} onClick={handleClickCell(story)} />
            ))}
          </Layout.FlexCol>
        )}
      </Layout.FlexCol>

      {activeIndex !== null && pinned[activeIndex] && (
        <CheckInPostViewer
          story={pinned[activeIndex]}
          onClose={() => setActiveIndex(null)}
          onPrev={activeIndex > 0 ? () => setActiveIndex(activeIndex - 1) : undefined}
          onNext={
            activeIndex < pinned.length - 1 ? () => setActiveIndex(activeIndex + 1) : undefined
          }
        />
      )}
    </MainScrollContainer>
  );
}

const EmptyState = styled.div`
  width: 100%;
  padding: 48px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default FriendPinnedSnippets;
