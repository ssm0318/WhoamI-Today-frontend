import { useState } from 'react';
import styled from 'styled-components';
import { Layout, Typo } from '@design-system';

export type MissionType = 'song' | 'question' | 'text' | 'compliment';

export interface Mission {
  prompt: string;
  type: MissionType;
}

export const MISSION_POOL: Mission[] = [
  { prompt: 'Share a song that matches your mood right now', type: 'song' },
  { prompt: 'Ask the community a question', type: 'question' },
  { prompt: 'Compliment someone today', type: 'compliment' },
  { prompt: 'Post a place you have been this week', type: 'text' },
  { prompt: 'Share something you learned recently', type: 'text' },
  { prompt: 'What are you looking forward to?', type: 'text' },
  { prompt: 'Share a song that reminds you of a friend', type: 'song' },
  { prompt: 'What is your comfort show right now?', type: 'text' },
  { prompt: 'Recommend a podcast or video', type: 'text' },
  { prompt: 'Share a photo from your camera roll', type: 'text' },
  { prompt: 'What is on your mind today?', type: 'question' },
  { prompt: 'Share your current favorite snack', type: 'text' },
  { prompt: 'What hobby have you picked up lately?', type: 'text' },
  { prompt: 'Share a quote that resonates with you', type: 'text' },
  { prompt: 'What made you smile today?', type: 'text' },
  { prompt: 'Share a song you have on repeat', type: 'song' },
  { prompt: 'What is the best thing that happened this week?', type: 'text' },
  { prompt: 'Describe your ideal weekend', type: 'text' },
  { prompt: 'What are you grateful for today?', type: 'text' },
  { prompt: 'Share a movie or show recommendation', type: 'text' },
  { prompt: 'What is something you want to try?', type: 'text' },
  { prompt: 'Share your current desktop or phone wallpaper', type: 'text' },
  { prompt: 'What are you reading right now?', type: 'text' },
  { prompt: 'Share a song that gives you energy', type: 'song' },
  { prompt: 'What is your go-to comfort food?', type: 'text' },
  { prompt: 'Ask your friends for a recommendation', type: 'question' },
  { prompt: 'Share a fun fact about yourself', type: 'text' },
  { prompt: 'What skill do you want to learn?', type: 'text' },
  { prompt: 'Share a song that calms you down', type: 'song' },
  { prompt: 'What is your unpopular opinion?', type: 'text' },
];

export function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

const MISSION_STORAGE_KEY = 'whoami_mission_attempts';
const MAX_ATTEMPTS = 5;

function getAttemptsToday(): number {
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

interface Props {
  onDoMission: (mission: Mission) => void;
}

function MissionOfTheDay({ onDoMission }: Props) {
  const todayMission = MISSION_POOL[getDayOfYear() % MISSION_POOL.length];
  const [attempts, setAttempts] = useState(getAttemptsToday());

  const allUsed = attempts >= MAX_ATTEMPTS;

  const handleDoIt = () => {
    if (allUsed) return;
    onDoMission(todayMission);
  };

  // Refresh attempts on re-render (e.g. returning from post flow)
  const currentAttempts = getAttemptsToday();
  if (currentAttempts !== attempts) {
    setAttempts(currentAttempts);
  }

  const buttonLabel = allUsed
    ? `All ${MAX_ATTEMPTS} attempts used`
    : attempts > 0
    ? `Do it (${attempts}/${MAX_ATTEMPTS} shared)`
    : 'Do it';

  return (
    <Layout.FlexCol gap={12} w="100%">
      <Typo type="title-medium" color="WHITE">
        {todayMission.prompt}
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
