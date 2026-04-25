import { MouseEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import LikeButton from '@components/_common/like-button/LikeButton';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Z_INDEX } from '@constants/layout';
import { Colors, Layout, Typo } from '@design-system';
import { CheckInPost, CheckInPostStory } from '@models/checkInPost';
import { getCheckInPost } from '@utils/apis/checkInPost';
import { convertTimeDiffByString } from '@utils/timeHelpers';

interface CheckInPostViewerProps {
  story: CheckInPostStory;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

function CheckInPostViewer({ story, onClose, onPrev, onNext }: CheckInPostViewerProps) {
  const [post, setPost] = useState<CheckInPost | null>(null);

  useEffect(() => {
    let cancelled = false;
    setPost(null);
    getCheckInPost(story.id)
      .then((data) => {
        if (!cancelled) setPost(data);
      })
      .catch(() => {
        if (!cancelled) setPost(null);
      });
    return () => {
      cancelled = true;
    };
  }, [story.id]);

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleLeft = (e: MouseEvent) => {
    e.stopPropagation();
    onPrev?.();
  };

  const handleRight = (e: MouseEvent) => {
    e.stopPropagation();
    onNext?.();
  };

  return (
    <Backdrop onClick={handleBackdropClick}>
      <Card onClick={(e) => e.stopPropagation()}>
        <Header>
          <Layout.FlexRow alignItems="center" gap={8}>
            <ProfileImage
              imageUrl={story.author_detail.profile_image}
              username={story.author_detail.username}
              size={32}
            />
            <Typo type="label-large" color="WHITE" bold>
              {story.author_detail.username}
            </Typo>
            <Typo type="label-small" color="LIGHT_GRAY">
              {convertTimeDiffByString({ day: new Date(story.created_at) })}
            </Typo>
          </Layout.FlexRow>
          <CloseBtn type="button" onClick={onClose}>
            ×
          </CloseBtn>
        </Header>

        {story.image_url && <StoryImage src={story.image_url} alt="check-in" />}

        {post?.caption && (
          <Caption>
            <Typo type="body-medium" color="WHITE">
              {post.caption}
            </Typo>
          </Caption>
        )}

        <Footer>
          {post && (
            <LikeButton
              postType="CheckInPost"
              postId={post.id}
              currentUserLikeId={post.current_user_like_id}
              iconSize={28}
            />
          )}
        </Footer>

        {onPrev && <NavZone $side="left" onClick={handleLeft} />}
        {onNext && <NavZone $side="right" onClick={handleRight} />}
      </Card>
    </Backdrop>
  );
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.92);
  z-index: ${Z_INDEX.COMMENT_LIKES_POPUP};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  max-width: 480px;
  height: 100%;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  background: black;
`;

const Header = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent);
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: ${Colors.WHITE};
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  padding: 0 8px;
`;

const StoryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const Caption = styled.div`
  position: absolute;
  bottom: 80px;
  left: 16px;
  right: 16px;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
`;

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  display: flex;
  justify-content: flex-start;
  z-index: 2;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
`;

const NavZone = styled.div<{ $side: 'left' | 'right' }>`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 25%;
  ${({ $side }) => ($side === 'left' ? 'left: 0;' : 'right: 0;')}
  cursor: pointer;
  z-index: 1;
`;

export default CheckInPostViewer;
