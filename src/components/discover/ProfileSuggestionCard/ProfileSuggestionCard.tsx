import { useNavigate } from 'react-router-dom';
import { Layout, Typo } from '@design-system';
import { ProfileSuggestionCardBody } from '@models/discover';
import * as S from './ProfileSuggestionCard.styled';

interface ProfileSuggestionCardProps {
  suggestion: ProfileSuggestionCardBody;
}

function ProfileSuggestionCard({ suggestion }: ProfileSuggestionCardProps) {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate('/settings/edit-profile');
  };

  return (
    <S.ProfileSuggestionWrapper>
      <Layout.FlexCol gap={8} w="100%">
        <Typo type="title-medium" color="BLACK">
          Complete your profile
        </Typo>
        <Typo type="body-medium" color="DARK_GRAY">
          Fill in your details so others can get to know you better.
        </Typo>
      </Layout.FlexCol>

      <Layout.FlexRow gap={8} style={{ flexWrap: 'wrap' }}>
        {suggestion.missingFields.map((field) => (
          <S.MissingFieldChip key={field}>
            <Typo type="label-medium" color="DARK_GRAY">
              {field}
            </Typo>
          </S.MissingFieldChip>
        ))}
      </Layout.FlexRow>

      <S.EditButton onClick={handleEditProfile}>
        <Typo type="label-large" color="WHITE" fontWeight={600}>
          Edit Profile
        </Typo>
      </S.EditButton>
    </S.ProfileSuggestionWrapper>
  );
}

export default ProfileSuggestionCard;
