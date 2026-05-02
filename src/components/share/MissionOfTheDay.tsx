import { useState } from 'react';
import styled from 'styled-components';
import { Layout, Typo } from '@design-system';
import { useMissions } from '@hooks/useMissions';
import { useTrackEvent } from '@hooks/useTrackEvent';

export type MissionType = 'song' | 'question' | 'text' | 'compliment';

export interface Mission {
  prompt: string;
  type: MissionType;
}

export function getDayOfYear(): number {
  const now = new Date();
  // 7 AM America/Los_Angeles boundary: the "day" changes at 7 AM LA time
  const laStr = now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
  const laTime = new Date(laStr);
  const shifted = new Date(laTime.getTime() - 7 * 60 * 60 * 1000);
  const start = new Date(shifted.getFullYear(), 0, 0);
  const diff = shifted.getTime() - start.getTime();
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
  // Fire the completion event directly through the WebView bridge —
  // this util is called from non-hook contexts (post-publish handlers in
  // Share.tsx / NewNoteHeader.tsx / NewResponse.tsx) so we can't use
  // useTrackEvent here. Bridge call mirrors what useTrackEvent emits.
  if (typeof window !== 'undefined' && window.ReactNativeWebView) {
    try {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          actionType: 'ANALYTICS_TRACK_EVENT',
          name: 'mission_completed',
          params: { attempt_number: current + 1 },
        }),
      );
    } catch {
      /* best-effort analytics */
    }
  }
}

interface Props {
  onDoMission: (mission: Mission) => void;
}

function MissionOfTheDay({ onDoMission }: Props) {
  const { missions } = useMissions();
  const todayMission = missions[getDayOfYear() % missions.length];
  const [attempts, setAttempts] = useState(getAttemptsToday());
  const trackEvent = useTrackEvent();

  const allUsed = attempts >= MAX_ATTEMPTS;

  const handleDoIt = () => {
    if (allUsed) return;
    // Funnel start: paired with mission_completed in markMissionCompleted.
    // Diff = users who tapped "Do it" but never published — abandon rate.
    trackEvent('mission_attempt_started', {
      mission_type: todayMission.type,
      attempt_number: attempts + 1,
    });
    onDoMission(todayMission);
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
