import { useEffect, useState } from 'react';
import HashTagPill from '@components/_common/hash-tag-pill/HashTagPill';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Button, Layout, Typo } from '@design-system';
import { friendList } from '@mock/friends';
import { MyProfile } from '@models/api/user';
import { PersonaItem } from '@models/discover';
import { useBoundStore } from '@stores/useBoundStore';
import { editProfile } from '@utils/apis/my';
import * as S from './SelectPersonaSection.styled';

// Mock data: 친구 프로필 이미지들 (처음 2개)
const friendProfiles = friendList.slice(0, 1);
const additionalFriendsCount = 6;

interface SelectPersonaSectionProps {
  personaList?: PersonaItem[];
  isSaved?: boolean;
  onSave?: () => void;
}

function SelectPersonaSection({
  personaList = [],
  isSaved = false,
  onSave,
}: SelectPersonaSectionProps) {
  const { updateMyProfile, openToast } = useBoundStore((state) => ({
    updateMyProfile: state.updateMyProfile,
    openToast: state.openToast,
  }));
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>([]);

  useEffect(() => {
    // API에서 받은 데이터로 초기 선택 상태 설정
    const initialSelected = personaList.filter((item) => item.is_selected).map((item) => item.key);
    setSelectedPersonas(initialSelected);
  }, [personaList]);

  const handleTogglePersona = (personaKey: string) => {
    setSelectedPersonas((prev) => {
      if (prev.includes(personaKey)) {
        return prev.filter((p) => p !== personaKey);
      }
      return [...prev, personaKey];
    });
  };

  const handleSave = () => {
    onSave?.();

    editProfile({
      profile: {
        user_personas: selectedPersonas,
      },
      onSuccess: (data: MyProfile) => {
        updateMyProfile({ ...data });
      },
      onError: (error) => {
        if (error.detail) openToast({ message: error.detail });
      },
    });
  };

  // Persona를 3줄로 나누기
  const personasPerRow = Math.ceil(personaList.length / 3);
  const personaRows = [
    personaList.slice(0, personasPerRow),
    personaList.slice(personasPerRow, personasPerRow * 2),
    personaList.slice(personasPerRow * 2, personasPerRow * 3),
  ];

  return (
    <S.SelectPersonaSectionWrapper>
      <S.Title>Select your Persona</S.Title>

      <S.PersonaGrid>
        {personaRows.map((row) => (
          <S.PersonaRow key={row.map((p) => p.key).join(',')}>
            {row.map((personaItem) => (
              <HashTagPill
                key={personaItem.key}
                isSelected={selectedPersonas.includes(personaItem.key)}
                onClick={() => handleTogglePersona(personaItem.key)}
                label={personaItem.label}
              />
            ))}
          </S.PersonaRow>
        ))}
      </S.PersonaGrid>

      <S.FriendsSection>
        <S.FriendsProfileList>
          {friendProfiles.map((friend, index) => (
            <Layout.FlexRow key={friend.id} ml={index === 0 ? 0 : -15} z={index}>
              <ProfileImage imageUrl={friend.profile_image} username={friend.username} size={24} />
            </Layout.FlexRow>
          ))}
        </S.FriendsProfileList>
        <Typo type="label-medium" color="WHITE" bold>
          +{additionalFriendsCount} friends have selected theirs
        </Typo>
      </S.FriendsSection>

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
    </S.SelectPersonaSectionWrapper>
  );
}

export default SelectPersonaSection;
