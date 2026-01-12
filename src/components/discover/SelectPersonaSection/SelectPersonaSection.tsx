import { useState } from 'react';
import HashTagPill from '@components/_common/hash-tag-pill/HashTagPill';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Button, Layout, Typo } from '@design-system';
import { friendList } from '@mock/friends';
import { MyProfile } from '@models/api/user';
import { Persona } from '@models/persona';
import { useBoundStore } from '@stores/useBoundStore';
import { editProfile } from '@utils/apis/my';
import * as S from './SelectPersonaSection.styled';

// Persona enum 값을 표시용 라벨로 변환
const formatPersonaLabel = (persona: Persona): string => {
  return persona
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Mock data: 친구 프로필 이미지들 (처음 2개)
const friendProfiles = friendList.slice(0, 1);
const additionalFriendsCount = 6;

interface SelectPersonaSectionProps {
  isSaved?: boolean;
  onSave?: () => void;
}

function SelectPersonaSection({ isSaved = false, onSave }: SelectPersonaSectionProps) {
  const { myProfile, updateMyProfile, openToast } = useBoundStore((state) => ({
    updateMyProfile: state.updateMyProfile,
    openToast: state.openToast,
    myProfile: state.myProfile,
  }));
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>(
    myProfile?.user_personas || [],
  );

  const handleTogglePersona = (persona: Persona) => {
    setSelectedPersonas((prev) => {
      if (prev.includes(persona)) {
        return prev.filter((p) => p !== persona);
      }
      return [...prev, persona];
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

  const availablePersonas = Object.values(Persona);

  // Persona를 3줄로 나누기
  const personasPerRow = Math.ceil(availablePersonas.length / 3);
  const personaRows = [
    availablePersonas.slice(0, personasPerRow),
    availablePersonas.slice(personasPerRow, personasPerRow * 2),
    availablePersonas.slice(personasPerRow * 2, personasPerRow * 3),
  ];

  return (
    <S.SelectPersonaSectionWrapper>
      <S.Title>Select your Persona</S.Title>

      <S.PersonaGrid>
        {personaRows.map((row) => (
          <S.PersonaRow key={row.join(',')}>
            {row.map((persona) => (
              <HashTagPill
                key={persona}
                isSelected={selectedPersonas.includes(persona)}
                onClick={() => handleTogglePersona(persona)}
                label={formatPersonaLabel(persona)}
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
