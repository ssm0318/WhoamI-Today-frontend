import { useState } from 'react';
import HashTagPill from '@components/_common/hash-tag-pill/HashTagPill';
import Icon from '@components/_common/icon/Icon';
import { Button, Typo } from '@design-system';
import * as S from './SelectInterestSection.styled';

// 관심사 목록 (이미지 기반)
const availableInterests: string[] = [
  'Climbing',
  'Gym & lifting',
  'Tech & gadgets',
  'Music',
  'Closed Book',
  'Cycling',
  'Sailing',
  'Dogs',
  'Ear',
  'Cuisine',
  'Travel',
  'Photography',
  'Reading',
  'Cooking',
  'Art',
  'Sports',
  'Movies',
  'Gaming',
];

// Mock data: 선택된 관심사 (초기값)
const initialSelectedInterests: string[] = ['Cycling', 'Sailing', 'Dogs'];

interface SelectInterestSectionProps {
  isSaved?: boolean;
  onSave?: () => void;
}

function SelectInterestSection({ isSaved = false, onSave }: SelectInterestSectionProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(initialSelectedInterests);

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
    // TODO: 실제 저장 로직 구현
  };

  // 관심사를 여러 줄로 나누기 (가로 스크롤 가능)
  const interestsPerRow = Math.ceil(availableInterests.length / 3);
  const interestRows = [
    availableInterests.slice(0, interestsPerRow),
    availableInterests.slice(interestsPerRow, interestsPerRow * 2),
    availableInterests.slice(interestsPerRow * 2, interestsPerRow * 3),
  ];

  return (
    <S.SelectInterestSectionWrapper>
      <S.Title>Select your interests</S.Title>

      <S.InterestGrid>
        {interestRows.map((row) => (
          <S.InterestRow key={row.join(',')}>
            {row.map((interest) => (
              <HashTagPill
                key={interest}
                isSelected={selectedInterests.includes(interest)}
                onClick={() => handleToggleInterest(interest)}
                label={interest}
              />
            ))}
          </S.InterestRow>
        ))}
      </S.InterestGrid>

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
