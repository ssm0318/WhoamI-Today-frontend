import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckInComponentEntry } from '@models/checkInEntry';
import { useBoundStore } from '@stores/useBoundStore';
import { toggleAcknowledgment } from '@utils/apis/privateReply';
import AcknowledgmentListBottomSheet from './AcknowledgmentListBottomSheet';
import PrivateCommentBottomSheet from './PrivateCommentBottomSheet';
import * as S from './PrivateReplySection.styled';

interface Props {
  entry: CheckInComponentEntry;
  friendUsername?: string;
  isOwner?: boolean;
}

function PrivateReplySection({ entry, friendUsername, isOwner = false }: Props) {
  const { t } = useTranslation();
  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));

  const [acknowledged, setAcknowledged] = useState(!!entry.my_acknowledgment);
  const [ackCount, setAckCount] = useState(entry.private_acknowledgment_count ?? 0);
  const [commentCount, setCommentCount] = useState(entry.private_comment_count ?? 0);
  const [hasMyComment, setHasMyComment] = useState(!!entry.has_my_private_comment);
  const [showThread, setShowThread] = useState(false);
  const [showAckList, setShowAckList] = useState(false);

  const handleAck = async (e: MouseEvent) => {
    e.stopPropagation();
    if (isOwner) {
      setShowAckList(true);
      return;
    }
    try {
      const res = await toggleAcknowledgment(entry.id);
      setAcknowledged(res.acknowledged);
      setAckCount(res.count);
      if (res.acknowledged) {
        openToast({ message: t('private_reply.high_five_toast') });
      } else {
        openToast({ message: t('private_reply.high_five_remove_toast') });
      }
    } catch {
      // optimistic revert on error is skipped intentionally
    }
  };

  const handleOpenThread = (e: MouseEvent) => {
    e.stopPropagation();
    setShowThread(true);
  };

  return (
    <>
      <S.Wrapper>
        {/* Make the privacy guarantee explicit on both sides — viewers shouldn't */}
        {/* worry the author sees their identity when reacting (they don't, the */}
        {/* counts are owner-only), and authors shouldn't worry that strangers */}
        {/* will see who reacted. */}
        <S.PrivacyHint aria-live="polite">
          🔒{' '}
          {isOwner
            ? 'Only you see these reactions and comments.'
            : friendUsername
            ? `Only ${friendUsername} sees this — your reactions and comments are private.`
            : 'Only the author sees these — your reactions and comments are private.'}
        </S.PrivacyHint>
        <S.Row>
          <S.AckButton
            $active={!isOwner && acknowledged}
            onClick={handleAck}
            aria-label="high-five"
          >
            🙌 {isOwner ? ackCount : ''}
          </S.AckButton>
          <S.CommentButton
            $active={!isOwner && hasMyComment}
            onClick={handleOpenThread}
            aria-label="private replies"
          >
            💬 {isOwner ? commentCount : ''}
          </S.CommentButton>
        </S.Row>
      </S.Wrapper>
      {showAckList && (
        <AcknowledgmentListBottomSheet entryId={entry.id} onClose={() => setShowAckList(false)} />
      )}
      {showThread && (
        <PrivateCommentBottomSheet
          entry={entry}
          friendUsername={friendUsername}
          isOwner={isOwner}
          onClose={() => setShowThread(false)}
          onCommentAdded={() => setCommentCount((c) => c + 1)}
          onCommented={() => setHasMyComment(true)}
        />
      )}
    </>
  );
}

export default PrivateReplySection;
