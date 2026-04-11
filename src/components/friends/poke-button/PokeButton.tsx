import { Emoji } from 'emoji-picker-react';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import CommonDialog from '@components/_common/alert-dialog/common-dialog/CommonDialog';
import { Typo } from '@design-system';
import { deletePoke, getPokeStatus, Poke, PokeComponentType, sendPoke } from '@utils/apis/poke';
import { getUnifiedEmoji } from '@utils/emojiHelpers';

interface Props {
  receiverId: number;
  componentType: PokeComponentType;
}

const POKE_LABELS: Record<PokeComponentType, { text: string; emoji: string }> = {
  battery: { text: 'Nudge for social battery', emoji: '🔋' },
  mood: { text: 'Nudge for mood', emoji: '😊' },
  thought: { text: 'Nudge for random thoughts', emoji: '💭' },
  song: { text: 'Nudge for a song', emoji: '🎵' },
};

const POKED_LABELS: Record<PokeComponentType, { text: string; emoji: string }> = {
  battery: { text: 'Nudged: battery', emoji: '✔️' },
  mood: { text: 'Nudged: mood', emoji: '✔️' },
  thought: { text: 'Nudged: thoughts', emoji: '✔️' },
  song: { text: 'Nudged: song', emoji: '✔️' },
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

  const label = isPoked ? POKED_LABELS[componentType] : POKE_LABELS[componentType];

  return (
    <>
      <PokeContainer $isPoked={isPoked} onClick={handlePoke}>
        <Typo type="label-large" color={isPoked ? 'MEDIUM_GRAY' : 'PRIMARY'}>
          {label.text}
        </Typo>
        <Emoji unified={getUnifiedEmoji(label.emoji)} size={14} lazyLoad />
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
  gap: 4px;
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
