import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDayOfYear } from '@components/share/MissionOfTheDay';
import { Layout, Typo } from '@design-system';
import { MissionPromptCardBody } from '@models/discover';
import * as S from './MissionPromptCard.styled';

const MISSION_STORAGE_KEY = 'whoami_mission_completed';

function isMissionCompletedToday(): boolean {
  const stored = localStorage.getItem(MISSION_STORAGE_KEY);
  if (!stored) return false;
  return stored === String(getDayOfYear());
}

function markMissionCompleted(): void {
  localStorage.setItem(MISSION_STORAGE_KEY, String(getDayOfYear()));
}

interface MissionPromptCardProps {
  mission: MissionPromptCardBody;
}

function MissionPromptCard({ mission }: MissionPromptCardProps) {
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(isMissionCompletedToday());

  const handleDoIt = () => {
    if (isCompleted) return;
    markMissionCompleted();
    setIsCompleted(true);

    // Navigate based on mission type
    if (mission.missionType === 'question') {
      navigate('/questions');
    } else {
      navigate('/notes/new');
    }
  };

  return (
    <S.MissionPromptWrapper>
      <Layout.FlexCol gap={8} w="100%">
        <Layout.LayoutBase style={{ opacity: 0.8 }}>
          <Typo type="label-medium" color="WHITE">
            Mission of the Day
          </Typo>
        </Layout.LayoutBase>
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
