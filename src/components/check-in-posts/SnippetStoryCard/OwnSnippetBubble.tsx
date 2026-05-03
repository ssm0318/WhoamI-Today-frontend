import { MouseEvent } from 'react';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Typo } from '@design-system';
import { CheckInPostStory } from '@models/checkInPost';
import * as S from './OwnSnippetBubble.styled';

interface OwnSnippetBubbleProps {
  story: CheckInPostStory;
  onClick: () => void;
  onAddClick: () => void;
}

function OwnSnippetBubble({ story, onClick, onAddClick }: OwnSnippetBubbleProps) {
  const { author_detail, has_unread } = story;
  const allRead = has_unread === false;

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  const handleAddClick = (e: MouseEvent) => {
    e.stopPropagation();
    onAddClick();
  };

  return (
    <S.Bubble onClick={handleClick}>
      <S.RingWrapper>
        <S.Ring $read={allRead}>
          <ProfileImage
            imageUrl={author_detail.profile_image}
            username={author_detail.username}
            size={60}
          />
        </S.Ring>
        <S.AddBadge onClick={handleAddClick}>
          <S.AddBadgeIcon>+</S.AddBadgeIcon>
        </S.AddBadge>
      </S.RingWrapper>
      <Typo type="label-small" color="BLACK" numberOfLines={1}>
        My snapshot
      </Typo>
    </S.Bubble>
  );
}

export default OwnSnippetBubble;
