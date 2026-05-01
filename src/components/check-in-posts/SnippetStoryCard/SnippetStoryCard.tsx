import { MouseEvent } from 'react';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { SvgIcon, Typo } from '@design-system';
import { CheckInPostStory } from '@models/checkInPost';
import * as S from './SnippetStoryCard.styled';

interface SnippetStoryCardProps {
  story: CheckInPostStory;
  onClick: () => void;
  showAuthorBadge?: boolean;
  hideUsername?: boolean;
  hidePinBadge?: boolean;
}

function SnippetStoryCard({
  story,
  onClick,
  showAuthorBadge = false,
  hideUsername = false,
  hidePinBadge = false,
}: SnippetStoryCardProps) {
  const { image_url, caption, is_pinned, author_detail } = story;

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <S.Card onClick={handleClick}>
      <S.ThumbWrapper>
        <S.Thumb>
          {image_url ? (
            <S.ThumbImage src={image_url} alt="snippet" />
          ) : (
            <S.TextThumb>
              <Typo type="label-small" color="DARK_GRAY" numberOfLines={3}>
                {caption || '…'}
              </Typo>
            </S.TextThumb>
          )}
          {is_pinned && !hidePinBadge && (
            <S.PinBadge aria-label="pinned">
              <SvgIcon name="pin_filled" size={14} color="PRIMARY" />
            </S.PinBadge>
          )}
        </S.Thumb>
        {showAuthorBadge && (
          <S.AuthorBadge>
            <ProfileImage
              imageUrl={author_detail.profile_image}
              username={author_detail.username}
              size={20}
            />
          </S.AuthorBadge>
        )}
      </S.ThumbWrapper>
      {!hideUsername && (
        <Typo type="label-small" color="BLACK" numberOfLines={1}>
          {author_detail.username}
        </Typo>
      )}
    </S.Card>
  );
}

export default SnippetStoryCard;
