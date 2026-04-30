import { MouseEvent } from 'react';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Typo } from '@design-system';
import { CheckInPostStory } from '@models/checkInPost';
import * as S from './SnippetAvatarBubble.styled';

interface SnippetAvatarBubbleProps {
  story: CheckInPostStory;
  onClick: () => void;
}

function SnippetAvatarBubble({ story, onClick }: SnippetAvatarBubbleProps) {
  const { author_detail } = story;

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <S.Bubble onClick={handleClick}>
      <S.Ring>
        <ProfileImage
          imageUrl={author_detail.profile_image}
          username={author_detail.username}
          size={60}
        />
      </S.Ring>
      <Typo type="label-small" color="BLACK" numberOfLines={1}>
        {author_detail.username}
      </Typo>
    </S.Bubble>
  );
}

export default SnippetAvatarBubble;
