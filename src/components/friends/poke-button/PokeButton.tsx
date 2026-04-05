import { MouseEvent, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import CommonDialog from '@components/_common/alert-dialog/common-dialog/CommonDialog';
import { Typo } from '@design-system';
import { deletePoke, getPokeStatus, Poke, PokeComponentType, sendPoke } from '@utils/apis/poke';

interface Props {
  receiverId: number;
  componentType: PokeComponentType;
}

const POKE_LABELS: Record<PokeComponentType, string> = {
  song: 'Nudge for a song \u{1F3B5}',
  status: 'Nudge for a vibe check \u{270C}\u{FE0F}',
  battery: 'Nudge to share how they feel \u{1F4AB}',
};

const POKED_LABELS: Record<PokeComponentType, string> = {
  song: 'Nudged: song \u{2714}\u{FE0F}',
  status: 'Nudged: vibe \u{2714}\u{FE0F}',
  battery: 'Nudged: battery \u{2714}\u{FE0F}',
};

function PokeButton({ receiverId, componentType }: Props) {
  const [pokeRecord, setPokeRecord] = useState<Poke | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isPoked = pokeRecord !== null;

  const fetchStatus = useCallback(async () => {
    try {
      const pokes = await getPokeStatus(receiverId);
      const match = pokes.find((p) => p.component_type === componentType);
      setPokeRecord(match ?? null);
    } catch {
      // ignore fetch errors
    }
  }, [receiverId, componentType]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleUnpoke = async () => {
    if (!pokeRecord) return;
    setShowConfirm(false);
    setIsLoading(true);
    try {
      await deletePoke(pokeRecord.id);
      setPokeRecord(null);
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  };

  const handlePoke = async (e: MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;

    if (isPoked) {
      setShowConfirm(true);
      return;
    }

    setIsLoading(true);
    try {
      const newPoke = await sendPoke(receiverId, componentType);
      setPokeRecord(newPoke);
    } catch {
      // Silently fail -- rate limit or network error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PokeContainer $isPoked={isPoked} onClick={handlePoke}>
        <Typo type="label-large" color={isPoked ? 'MEDIUM_GRAY' : 'PRIMARY'}>
          {isPoked ? POKED_LABELS[componentType] : POKE_LABELS[componentType]}
        </Typo>
      </PokeContainer>
      <CommonDialog
        visible={showConfirm}
        title="Un-nudge?"
        content="This will remove your nudge."
        cancelText="Cancel"
        confirmText="Remove"
        confirmTextColor="WARNING"
        onClickConfirm={handleUnpoke}
        onClickClose={() => setShowConfirm(false)}
      />
    </>
  );
}

const PokeContainer = styled.div<{ $isPoked: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 8px;
  border: 1px solid ${({ $isPoked }) => ($isPoked ? '#E0E0E0' : '#D9D9D9')};
  background-color: ${({ $isPoked }) => ($isPoked ? '#F5F5F5' : '#FFFFFF')};
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  transition: all 0.15s ease;

  &:active {
    opacity: 0.7;
  }
`;

export default PokeButton;
