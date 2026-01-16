import { useEffect, useState } from 'react';
import HashTagPill from '@components/_common/hash-tag-pill/HashTagPill';
import Icon from '@components/_common/icon/Icon';
import { Button, Typo } from '@design-system';
import { InterestItem } from '@models/discover';
import * as S from './SelectInterestSection.styled';

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
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    // API에서 받은 데이터로 초기 선택 상태 설정
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
    // TODO: 실제 저장 API 연동
  };

  // 관심사를 3줄로 나누기
  const interestsPerRow = Math.ceil(interestList.length / 3);
  const interestRows = [
    interestList.slice(0, interestsPerRow),
    interestList.slice(interestsPerRow, interestsPerRow * 2),
    interestList.slice(interestsPerRow * 2, interestsPerRow * 3),
  ];

  return (
    <S.SelectInterestSectionWrapper>
      <S.Title>Select your interests</S.Title>

      <S.InterestGrid>
        {interestRows.map((row) => (
          <S.InterestRow key={row.map((i) => i.content).join(',')}>
            {row.map((interestItem) => (
              <HashTagPill
                key={interestItem.content}
                isSelected={selectedInterests.includes(interestItem.content)}
                onClick={() => handleToggleInterest(interestItem.content)}
                label={interestItem.content}
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
