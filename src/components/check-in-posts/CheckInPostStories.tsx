import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Colors, Layout, Typo } from '@design-system';
import { CheckInPostStory } from '@models/checkInPost';
import { getCheckInPostStories, getUserCheckInPosts } from '@utils/apis/checkInPost';
import CheckInPostViewer from './CheckInPostViewer';

interface CheckInPostStoriesProps {
  /** When provided, the strip lists only this user's posts (for friend's UserPage). */
  authorUserId?: number;
  showCompose?: boolean;
}

function CheckInPostStories({ authorUserId, showCompose = false }: CheckInPostStoriesProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'check_in_post' });
  const navigate = useNavigate();

  const [stories, setStories] = useState<CheckInPostStory[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetcher = authorUserId ? getUserCheckInPosts(authorUserId) : getCheckInPostStories();
    fetcher
      .then((data) => {
        if (cancelled) return;
        setStories(data.results ?? []);
      })
      .catch(() => {
        if (cancelled) return;
        setStories([]);
      });
    return () => {
      cancelled = true;
    };
  }, [authorUserId]);

  const handleClickStory = (index: number) => () => setActiveIndex(index);
  const handleClose = () => setActiveIndex(null);

  if (!showCompose && stories.length === 0) return null;

  return (
    <>
      <Strip>
        {showCompose && (
          <ComposeBubble onClick={() => navigate('/check-in-posts/new')}>
            <Plus>+</Plus>
            <ComposeLabel>
              <Typo type="label-large" color="DARK_GRAY">
                {t('compose')}
              </Typo>
            </ComposeLabel>
          </ComposeBubble>
        )}
        {stories.map((story, idx) => (
          <Bubble key={story.id} onClick={handleClickStory(idx)}>
            <ProfileImage
              imageUrl={story.author_detail.profile_image}
              username={story.author_detail.username}
              size={56}
            />
            <Typo type="label-small" color="BLACK" numberOfLines={1}>
              {story.author_detail.username}
            </Typo>
          </Bubble>
        ))}
      </Strip>
      {activeIndex !== null && stories[activeIndex] && (
        <CheckInPostViewer
          story={stories[activeIndex]}
          onClose={handleClose}
          onPrev={activeIndex > 0 ? () => setActiveIndex(activeIndex - 1) : undefined}
          onNext={
            activeIndex < stories.length - 1 ? () => setActiveIndex(activeIndex + 1) : undefined
          }
        />
      )}
    </>
  );
}

const Strip = styled(Layout.FlexRow)`
  width: 100%;
  gap: 12px;
  padding: 12px 16px;
  overflow-x: auto;
  background-color: ${Colors.WHITE};
  border-bottom: 1px solid ${Colors.LIGHT};
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Bubble = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  width: 64px;
  padding: 0;
`;

const ComposeBubble = styled(Bubble)`
  width: auto;
`;

const ComposeLabel = styled.span`
  white-space: nowrap;
`;

const Plus = styled.span`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px dashed ${Colors.MEDIUM_GRAY};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: ${Colors.DARK_GRAY};
`;

export default CheckInPostStories;
