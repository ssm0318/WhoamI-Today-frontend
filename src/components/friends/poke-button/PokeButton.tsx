import { MouseEvent, useState } from 'react';
import styled from 'styled-components';
import { Typo } from '@design-system';
import { PokeComponentType, sendPoke } from '@utils/apis/poke';

interface Props {
  receiverId: number;
  componentType: PokeComponentType;
  isPoked?: boolean;
}

const POKE_LABELS: Record<PokeComponentType, string> = {
  song: 'Nudge for a song \u{1F3B5}',
  status: 'Nudge for a vibe check \u{270C}\u{FE0F}',
  battery: 'Nudge to share how they feel \u{1F4AB}',
};

const POKED_LABEL = 'Poked \u{2714}\u{FE0F}';

function PokeButton({ receiverId, componentType, isPoked: initialPoked = false }: Props) {
  const [isPoked, setIsPoked] = useState(initialPoked);
  const [isLoading, setIsLoading] = useState(false);

  const handlePoke = async (e: MouseEvent) => {
    e.stopPropagation();
    if (isPoked || isLoading) return;

    setIsLoading(true);
    try {
      await sendPoke(receiverId, componentType);
      setIsPoked(true);
    } catch {
      // Silently fail — rate limit or network error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PokeContainer $isPoked={isPoked} onClick={handlePoke}>
      <Typo type="label-medium" color={isPoked ? 'MEDIUM_GRAY' : 'PRIMARY'}>
        {isPoked ? POKED_LABEL : POKE_LABELS[componentType]}
      </Typo>
    </PokeContainer>
  );
}

const PokeContainer = styled.div<{ $isPoked: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid ${({ $isPoked }) => ($isPoked ? '#E0E0E0' : '#D9D9D9')};
  background-color: ${({ $isPoked }) => ($isPoked ? '#F5F5F5' : '#FFFFFF')};
  cursor: ${({ $isPoked }) => ($isPoked ? 'default' : 'pointer')};
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  transition: all 0.15s ease;

  &:active {
    opacity: ${({ $isPoked }) => ($isPoked ? 1 : 0.7)};
  }
`;

export default PokeButton;
