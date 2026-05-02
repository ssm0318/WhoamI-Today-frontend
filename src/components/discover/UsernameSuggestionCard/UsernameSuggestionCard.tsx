import { useNavigate } from 'react-router-dom';
import { Button, Layout, Typo } from '@design-system';
import { UsernameSuggestionCardBody } from '@models/discover';
import * as S from './UsernameSuggestionCard.styled';

interface UsernameSuggestionCardProps {
  suggestion: UsernameSuggestionCardBody;
}

function UsernameSuggestionCard({ suggestion }: UsernameSuggestionCardProps) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate('/settings/edit-profile?tab=pronouns_bio');
  };

  return (
    <S.UsernameSuggestionWrapper>
      <Layout.FlexCol gap={8} w="100%">
        <Typo type="head-line" color="BLACK" bold>
          Make your username yours
        </Typo>
        <Typo type="body-medium" color="DARK">
          We started you off with a placeholder. Update it to something that reflects you!
        </Typo>
      </Layout.FlexCol>

      <S.UsernameChip>
        <Typo type="label-medium" color="DARK_GRAY">
          @{suggestion.currentUsername}
        </Typo>
      </S.UsernameChip>

      <S.EditButtonWrapper>
        <Button.Primary text="Edit username" onClick={handleEdit} status="normal" />
      </S.EditButtonWrapper>
    </S.UsernameSuggestionWrapper>
  );
}

export default UsernameSuggestionCard;
