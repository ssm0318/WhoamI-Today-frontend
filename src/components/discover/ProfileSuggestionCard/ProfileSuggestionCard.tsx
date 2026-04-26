import { useNavigate } from 'react-router-dom';
import { Button, Layout, Typo } from '@design-system';
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
        <Typo type="head-line" color="WHITE" bold>
          Complete your profile
        </Typo>
        <Typo type="body-medium" color="WHITE">
          Fill in your details so others can get to know you better.
        </Typo>
      </Layout.FlexCol>

      <Layout.FlexRow gap={8} style={{ flexWrap: 'wrap' }}>
        {suggestion.missingFields.map((field) => (
          <S.MissingFieldChip key={field}>
            <Typo type="label-medium" color="PRIMARY">
              + {field}
            </Typo>
          </S.MissingFieldChip>
        ))}
      </Layout.FlexRow>

      <S.EditButtonWrapper>
        <Button.Primary text="Edit Profile" onClick={handleEditProfile} status="normal" />
      </S.EditButtonWrapper>
    </S.ProfileSuggestionWrapper>
  );
}

export default ProfileSuggestionCard;
