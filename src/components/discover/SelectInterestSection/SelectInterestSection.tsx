import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import { Button, Typo } from '@design-system';
import { useTrackEvent } from '@hooks/useTrackEvent';
import * as S from './SelectInterestSection.styled';

interface SelectInterestSectionProps {
  categoryLabel?: string;
  isSaved?: boolean;
  onSave?: () => void;
}

function SelectInterestSection({
  categoryLabel,
  isSaved = false,
  onSave,
}: SelectInterestSectionProps) {
  const navigate = useNavigate();
  const trackEvent = useTrackEvent();

  const handleClickAddInterests = () => {
    // Card-CTA conversion. categoryLabel distinguishes the per-category
    // variants (Music, Hobbies, etc.) when the card is reused.
    trackEvent('discover_add_interests_tapped', {
      category_label: categoryLabel || 'default',
    });
    onSave?.();
    navigate('/settings/edit-profile?tab=interests');
  };

  return (
    <S.SelectInterestSectionWrapper>
      <S.TextBlock>
        <Typo type="head-line" color="WHITE" bold>
          {categoryLabel || 'Add your interests'}
        </Typo>
        <Typo type="body-medium" color="WHITE">
          Tell us what you&apos;re into so we can recommend friends and content you&apos;ll love.
        </Typo>
        <Typo type="label-medium" color="WHITE">
          Only takes a minute — you can update them anytime in your profile.
        </Typo>
      </S.TextBlock>

      {!isSaved ? (
        <S.SaveButtonWrapper>
          <Button.Primary text="Add interests" onClick={handleClickAddInterests} status="normal" />
        </S.SaveButtonWrapper>
      ) : (
        <S.SavedMessage>
          <Icon name="circle_check" size={20} />
          <Typo type="body-medium" color="WHITE">
            Saved to your Profile
          </Typo>
        </S.SavedMessage>
      )}
    </S.SelectInterestSectionWrapper>
  );
}

export default SelectInterestSection;
