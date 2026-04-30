import { Emoji } from 'emoji-picker-react';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import CommonDialog from '@components/_common/alert-dialog/common-dialog/CommonDialog';
import { Typo } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { deletePoke, getPokeStatus, Poke, PokeComponentType, sendPoke } from '@utils/apis/poke';
import { getUnifiedEmoji } from '@utils/emojiHelpers';

interface Props {
  receiverId: number;
  componentType: PokeComponentType;
  initialPokeId?: number | null;
}

const POKE_LABELS: Record<PokeComponentType, { text: string; emoji: string }> = {
  battery: { text: 'Ping for social battery', emoji: '🔋' },
  mood: { text: 'Ping for mood', emoji: '😊' },
  thought: { text: 'Ping for a blurb', emoji: '💭' },
  song: { text: 'Ping for a song', emoji: '🎵' },
};

const POKED_LABELS: Record<PokeComponentType, { text: string; emoji: string }> = {
  battery: { text: 'Pinged: battery', emoji: '✔️' },
  mood: { text: 'Pinged: mood', emoji: '✔️' },
  thought: { text: 'Pinged: blurb', emoji: '✔️' },
  song: { text: 'Pinged: song', emoji: '✔️' },
};

function PokeButton({ receiverId, componentType, initialPokeId }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'friend' });
  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));
  const [pokeRecord, setPokeRecord] = useState<Poke | null>(
    initialPokeId
      ? ({ id: initialPokeId, component_type: componentType, receiver: receiverId } as Poke)
      : null,
  );
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
    if (initialPokeId !== undefined) return;
    fetchStatus();
  }, [fetchStatus, initialPokeId]);

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
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const status = (err as { response: { status: number } }).response?.status;
        if (status === 429) {
          openToast({ message: t('ping_daily_limit') });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const label = isPoked ? POKED_LABELS[componentType] : POKE_LABELS[componentType];

  return (
    <>
      <PokeContainer $isPoked={isPoked} onClick={handlePoke}>
        {/* ~10% lighter than DARK_GRAY/MEDIUM_GRAY via wrapper opacity —
            keeps the palette key intact but softens the label visually
            so it reads as a gentle prompt rather than a filled CTA. */}
        <span style={{ opacity: 0.88 }}>
          <Typo type="label-large" color={isPoked ? 'MEDIUM_GRAY' : 'DARK_GRAY'}>
            {label.text}
          </Typo>
        </span>
        <Emoji unified={getUnifiedEmoji(label.emoji)} size={14} lazyLoad />
      </PokeContainer>
      <CommonDialog
        visible={showConfirm}
        title="Un-ping?"
        content="This will remove your ping."
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
  /* Dotted border matches the profile empty-state placeholders ("+ Bio",
     "+ Your song"), so ping prompts read as "you can add/suggest this"
     rather than as filled chips competing with the check-in content. */
  border: 1px dashed ${({ $isPoked }) => ($isPoked ? '#E0E0E0' : '#D9D9D9')};
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
