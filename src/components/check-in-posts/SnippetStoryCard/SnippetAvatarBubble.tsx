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
  const { author_detail, has_unread } = story;
  const allRead = has_unread === false;
  const snapshotLabel =
    story.visibility === 'close_friends' ? 'close friends snapshot' : 'daily snapshot';

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <S.Bubble onClick={handleClick} aria-label={`${author_detail.username} ${snapshotLabel}`}>
      <S.RingWrapper>
        <S.Ring $read={allRead} $visibility={story.visibility}>
          <ProfileImage
            imageUrl={author_detail.profile_image}
            username={author_detail.username}
            size={60}
          />
        </S.Ring>
      </S.RingWrapper>
      <Typo type="label-small" color="BLACK" numberOfLines={1}>
        {author_detail.username}
      </Typo>
    </S.Bubble>
  );
}

export default SnippetAvatarBubble;
