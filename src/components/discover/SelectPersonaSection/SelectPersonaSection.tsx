import { useState } from 'react';
import HashTagPill from '@components/_common/hash-tag-pill/HashTagPill';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Button, Layout, Typo } from '@design-system';
import { friendList } from '@mock/friends';
import { Persona } from '@models/persona';
import * as S from './SelectPersonaSection.styled';

// Persona enum 값을 표시용 라벨로 변환
const formatPersonaLabel = (persona: Persona): string => {
  return persona
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Mock data: 선택 가능한 Persona 목록 (가로 스크롤 테스트를 위해 더 많은 항목 추가)
const availablePersonas: Persona[] = [
  Persona.content_creator,
  Persona.lurker,
  Persona.word_person,
  Persona.photo_heavy,
  Persona.deep_talks,
  Persona.occasional_poster,
  Persona.private_reactor,
  Persona.commenter,
  Persona.open_book,
  Persona.curated_aesthetic,
  Persona.emoji_fan,
  Persona.thoughtful_responder,
  Persona.instant_responder,
  Persona.poster,
  Persona.text_poster,
];

// Mock data: 선택된 Persona (초기값)
const initialSelectedPersonas: Persona[] = [
  Persona.private_reactor,
  Persona.commenter,
  Persona.open_book,
];

// Mock data: 친구 프로필 이미지들 (처음 2개)
const friendProfiles = friendList.slice(0, 1);
const additionalFriendsCount = 6;

interface SelectPersonaSectionProps {
  isSaved?: boolean;
  onSave?: () => void;
}

function SelectPersonaSection({ isSaved = false, onSave }: SelectPersonaSectionProps) {
  const [selectedPersonas, setSelectedPersonas] = useState<Persona[]>(initialSelectedPersonas);

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
    // TODO: 실제 저장 로직 구현
  };

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
              <ProfileImage imageUrl={friend.profile_image} username={friend.username} size={32} />
            </Layout.FlexRow>
          ))}
        </S.FriendsProfileList>
        <Typo type="body-medium" color="WHITE">
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
