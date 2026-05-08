import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Layout, Typo } from '@design-system';
import { useMissionToday } from '@hooks/useMissionToday';
import { useTrackEvent } from '@hooks/useTrackEvent';

export type MissionType = 'song' | 'question' | 'text' | 'compliment' | 'none';

export interface Mission {
  id: number;
  prompt: string;
  type: MissionType;
  // type='none' suppresses the primary "Do it" button (no post creation flow).
  cta_url: string;
  // Label for the optional secondary action button. The mission card renders
  // this button whenever cta_url is non-empty; for type='none' missions this
  // is the only button.
  cta_label: string;
}

interface Props {
  onDoMission: (mission: Mission) => void;
}

function MissionOfTheDay({ onDoMission }: Props) {
  const { mission, isLoading, error, refresh } = useMissionToday();
  const trackEvent = useTrackEvent();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Layout.FlexCol gap={12} w="100%">
        <Typo type="title-medium" color="WHITE">
          {`Loading today's mission...`}
        </Typo>
      </Layout.FlexCol>
    );
  }

  if (error || !mission) {
    return (
      <Layout.FlexCol gap={12} w="100%">
        <Typo type="title-medium" color="WHITE">
          {`Today's mission isn't available right now.`}
        </Typo>
        <ActionButton onClick={() => refresh()} $isCompleted={false}>
          <Typo type="label-large" color="PRIMARY" fontWeight={600}>
            Refresh
          </Typo>
        </ActionButton>
      </Layout.FlexCol>
    );
  }

  const { attempts_used, attempts_remaining } = mission;
  const allUsed = attempts_remaining <= 0;
  const showDoIt = mission.type !== 'none';
  const showCta = !!mission.cta_url;

  const handleDoIt = () => {
    if (allUsed) return;
    // Funnel start: paired with mission_completed analytics in NewNoteHeader.
    // Diff = users who tapped "Do it" but never published — abandon rate.
    trackEvent('mission_attempt_started', {
      mission_type: mission.type,
      attempt_number: attempts_used + 1,
    });
    onDoMission({
      id: mission.id,
      prompt: mission.prompt,
      type: mission.type,
      cta_url: mission.cta_url,
      cta_label: mission.cta_label,
    });
  };

  const handleCta = () => {
    if (!mission.cta_url) return;
    navigate(mission.cta_url);
  };

  const doItLabel = allUsed
    ? 'No attempts left today'
    : attempts_used > 0
    ? `Try again (${attempts_remaining} left)`
    : 'Do it';

  return (
    <Layout.FlexCol gap={12} w="100%">
      <Typo type="title-medium" color="WHITE">
        {mission.prompt}
      </Typo>
      <Layout.FlexCol gap={8}>
        {showDoIt && (
          <ActionButton onClick={handleDoIt} $isCompleted={allUsed}>
            <Typo type="label-large" color={allUsed ? 'MEDIUM_GRAY' : 'PRIMARY'} fontWeight={600}>
              {doItLabel}
            </Typo>
          </ActionButton>
        )}
        {showCta && (
          <ActionButton onClick={handleCta} $isCompleted={false}>
            <Typo type="label-large" color="PRIMARY" fontWeight={600}>
              {mission.cta_label || 'Go'}
            </Typo>
          </ActionButton>
        )}
      </Layout.FlexCol>
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
