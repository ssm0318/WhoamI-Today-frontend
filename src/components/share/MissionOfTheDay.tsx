import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Layout, Typo } from '@design-system';
import { useDailyMission } from '@hooks/useDailyMission';
import { MissionType } from '@models/mission';

export type { MissionType } from '@models/mission';

export function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

const MISSION_STORAGE_KEY = 'whoami_mission_attempts';
const MAX_ATTEMPTS = 5;

export function getAttemptsToday(): number {
  const stored = localStorage.getItem(MISSION_STORAGE_KEY);
  if (!stored) return 0;
  try {
    const parsed = JSON.parse(stored);
    if (parsed.day === getDayOfYear()) return parsed.count;
  } catch {
    // ignore
  }
  return 0;
}

export function markMissionCompleted(): void {
  const current = getAttemptsToday();
  localStorage.setItem(
    MISSION_STORAGE_KEY,
    JSON.stringify({ day: getDayOfYear(), count: current + 1 }),
  );
}

interface MissionCallbackArg {
  prompt: string;
  type: MissionType;
}

interface Props {
  onDoMission: (mission: MissionCallbackArg) => void;
}

function MissionOfTheDay({ onDoMission }: Props) {
  const { i18n } = useTranslation();
  const { mission } = useDailyMission();
  const [attempts, setAttempts] = useState(getAttemptsToday());

  if (!mission) return null;

  const prompt =
    i18n.language === 'ko' ? mission.prompt_ko || mission.prompt_en : mission.prompt_en;

  const allUsed = attempts >= MAX_ATTEMPTS;

  const handleDoIt = () => {
    if (allUsed) return;
    onDoMission({ prompt, type: mission.type });
  };

  // Refresh attempts on re-render (e.g. returning from post flow)
  const currentAttempts = getAttemptsToday();
  if (currentAttempts !== attempts) {
    setAttempts(currentAttempts);
  }

  const remaining = MAX_ATTEMPTS - attempts;
  const buttonLabel = allUsed
    ? 'No attempts left today'
    : attempts > 0
    ? `Try again (${remaining} left)`
    : 'Do it';

  return (
    <Layout.FlexCol gap={12} w="100%">
      <Typo type="title-medium" color="WHITE">
        {prompt}
      </Typo>
      <ActionButton onClick={handleDoIt} $isCompleted={allUsed}>
        <Typo type="label-large" color={allUsed ? 'MEDIUM_GRAY' : 'PRIMARY'} fontWeight={600}>
          {buttonLabel}
        </Typo>
      </ActionButton>
    </Layout.FlexCol>
  );
}

const ActionButton = styled.div<{ $isCompleted: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  border-radius: 12px;
  background-color: ${({ $isCompleted }) =>
    $isCompleted ? '#F5F5F5' : 'rgba(255, 255, 255, 0.95)'};
  cursor: ${({ $isCompleted }) => ($isCompleted ? 'default' : 'pointer')};
  align-self: flex-start;
  -webkit-tap-highlight-color: transparent;

  &:active {
    opacity: ${({ $isCompleted }) => ($isCompleted ? 1 : 0.8)};
  }
`;

export default MissionOfTheDay;
