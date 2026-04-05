import { useEffect, useState } from 'react';
import HashTagPill from '@components/_common/hash-tag-pill/HashTagPill';
import Icon from '@components/_common/icon/Icon';
import { Button, Typo } from '@design-system';
import { MyProfile } from '@models/api/user';
import { InterestItem } from '@models/discover';
import { useBoundStore } from '@stores/useBoundStore';
import { editProfile } from '@utils/apis/my';
import * as S from './SelectInterestSection.styled';

const COLLAPSED_COUNT = 10;

interface SelectInterestSectionProps {
  interestList?: InterestItem[];
  isSaved?: boolean;
  onSave?: () => void;
}

function SelectInterestSection({
  interestList = [],
  isSaved = false,
  onSave,
}: SelectInterestSectionProps) {
  const { updateMyProfile, openToast } = useBoundStore((state) => ({
    updateMyProfile: state.updateMyProfile,
    openToast: state.openToast,
  }));
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const initialSelected = interestList
      .filter((item) => item.is_selected)
      .map((item) => item.content);
    setSelectedInterests(initialSelected);
  }, [interestList]);

  const handleToggleInterest = (interest: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((i) => i !== interest);
      }
      return [...prev, interest];
    });
  };

  const handleSave = () => {
    onSave?.();

    editProfile({
      profile: {
        user_interests: selectedInterests,
      },
      onSuccess: (data: MyProfile) => {
        updateMyProfile({ ...data });
      },
      onError: (error) => {
        if (error.detail) openToast({ message: error.detail });
      },
    });
  };

  const displayList = isExpanded ? interestList : interestList.slice(0, COLLAPSED_COUNT);

  return (
    <S.SelectInterestSectionWrapper>
      <Typo type="title-medium" color="WHITE" ml={16}>
        Select your interests
      </Typo>

      <S.InterestGrid>
        {displayList.map((interestItem) => (
          <HashTagPill
            key={interestItem.content}
            isSelected={selectedInterests.includes(interestItem.content)}
            onClick={() => handleToggleInterest(interestItem.content)}
            label={interestItem.content}
          />
        ))}
      </S.InterestGrid>

      {interestList.length > COLLAPSED_COUNT && (
        <S.ExpandToggle onClick={() => setIsExpanded(!isExpanded)}>
          <Icon name={isExpanded ? 'chevron_up' : 'chevron_down'} size={20} />
        </S.ExpandToggle>
      )}

      {!isSaved ? (
        <S.SaveButtonWrapper>
          <Button.Primary text="Save to your Profile" onClick={handleSave} status="normal" />
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
