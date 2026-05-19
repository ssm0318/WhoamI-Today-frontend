import { MouseEvent } from 'react';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { IconNames, SvgIcon, Typo } from '@design-system';
import { CheckInPostStory } from '@models/checkInPost';
import * as S from './OwnSnippetBubble.styled';

interface OwnSnippetBubbleProps {
  story: CheckInPostStory;
  onClick: () => void;
  onAddClick: () => void;
}

type VisibilityMeta = {
  icon: IconNames;
  label: string;
};

const VISIBILITY_META: Record<CheckInPostStory['visibility'], VisibilityMeta> = {
  friends: { icon: 'default_friend', label: 'Friends snapshot' },
  close_friends: { icon: 'close_friend', label: 'Close friends snapshot' },
  public: { icon: 'eye', label: 'Public snapshot' },
};

function OwnSnippetBubble({ story, onClick, onAddClick }: OwnSnippetBubbleProps) {
  const { author_detail, has_unread } = story;
  const allRead = has_unread === false;
  const visibilityMeta = VISIBILITY_META[story.visibility];

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
        <S.Ring $read={allRead} $visibility={story.visibility}>
          <ProfileImage
            imageUrl={author_detail.profile_image}
            username={author_detail.username}
            size={60}
          />
        </S.Ring>
        <S.VisibilityBadge
          $visibility={story.visibility}
          role="img"
          aria-label={visibilityMeta.label}
        >
          <SvgIcon name={visibilityMeta.icon} size={12} color="WHITE" fill="WHITE" />
        </S.VisibilityBadge>
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
