import { useNavigate } from 'react-router-dom';
import { getAttemptsToday } from '@components/share/MissionOfTheDay';
import { Layout, Typo } from '@design-system';
import { MissionPromptCardBody } from '@models/discover';
import * as S from './MissionPromptCard.styled';

interface MissionPromptCardProps {
  mission: MissionPromptCardBody;
}

function MissionPromptCard({ mission }: MissionPromptCardProps) {
  const navigate = useNavigate();
  const isCompleted = getAttemptsToday() > 0;

  const handleDoIt = () => {
    if (isCompleted) return;

    // Navigate to creation page — completion is marked after successful post
    if (mission.missionType === 'question') {
      navigate('/questions', { state: { missionMode: true } });
    } else {
      navigate('/notes/new', { state: { missionMode: true } });
    }
  };

  return (
    <S.MissionPromptWrapper>
      <Layout.FlexCol gap={8} w="100%">
        <Layout.FlexRow bgColor="TERTIARY_GREEN" ph={8} pv={2} rounded={100}>
          <Typo bold type="label-medium" color="WHITE">
            Mission of the Day
          </Typo>
        </Layout.FlexRow>
        <Typo type="title-medium" color="WHITE">
          {mission.prompt}
        </Typo>
      </Layout.FlexCol>
      <S.DoItButton onClick={handleDoIt} $isCompleted={isCompleted}>
        <Typo type="label-large" color={isCompleted ? 'MEDIUM_GRAY' : 'PRIMARY'} fontWeight={600}>
          {isCompleted ? 'Done \u2713' : 'Do it'}
        </Typo>
      </S.DoItButton>
    </S.MissionPromptWrapper>
  );
}

export default MissionPromptCard;
