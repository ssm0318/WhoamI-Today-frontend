import { format } from 'date-fns';
import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import SharedContentCard from '@components/chat/shared-content-card/SharedContentCard';
import { Layout, Typo } from '@design-system';
import { ChatEmojiDict, ChatEmojiType, RefinedChatMessage } from '@models/chat';
import { addMessageReaction, removeMessageReaction } from '@utils/apis/chat';
import {
  LeftBubble,
  LeftMessageWrapper,
  ParentPreview,
  ReactionBadge,
  RightBubble,
  RightMessageWrapper,
} from './ChatMessageItem.styled';

const DOUBLE_TAP_DELAY = 300;
const LONG_PRESS_DELAY = 500;
const LONG_PRESS_MOVE_THRESHOLD = 10;

const REACTION_EMOJIS: ChatEmojiType[] = [
  ChatEmojiType.HEART,
  ChatEmojiType.LAUGH,
  ChatEmojiType.CRY,
  ChatEmojiType.SMILE,
  ChatEmojiType.WAVE,
];

interface Props {
  message: RefinedChatMessage;
  isMine: boolean;
  onReactionUpdate?: () => void;
}

function ChatMessageItem({ message, isMine, onReactionUpdate }: Props) {
  const {
    content,
    emoji,
    created_at,
    show_date,
    reactions,
    parent_preview,
    shared_content_preview,
  } = message;

  const date = new Date(created_at);
  const lastTapRef = useRef<number>(0);
  const longPressTimer = useRef<ReturnType<typeof setTimeout>>();
  const touchStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);

  // Double-tap (mobile)
  const handleTouchEnd = () => {
    clearTimeout(longPressTimer.current);
    const now = Date.now();
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      handleHeartToggle();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  // Double-click (desktop)
  const handleDoubleClick = () => {
    handleHeartToggle();
  };

  // Long-press start
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    longPressTimer.current = setTimeout(() => {
      setShowEmojiPicker(true);
    }, LONG_PRESS_DELAY);
  };

  // Long-press cancel on move
  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchStartPos.current.x);
    const dy = Math.abs(touch.clientY - touchStartPos.current.y);
    if (dx > LONG_PRESS_MOVE_THRESHOLD || dy > LONG_PRESS_MOVE_THRESHOLD) {
      clearTimeout(longPressTimer.current);
    }
  };

  // Right-click as desktop long-press alternative
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleHeartToggle = async () => {
    const heartReaction = reactions.find((r) => r.emoji === 'heart' && r.my_reaction_id);
    if (heartReaction?.my_reaction_id) {
      await removeMessageReaction(heartReaction.my_reaction_id);
    } else {
      await addMessageReaction(message.id, 'heart');
    }
    onReactionUpdate?.();
  };

  const handleEmojiReact = async (emojiType: ChatEmojiType) => {
    setShowEmojiPicker(false);
    const existing = reactions.find((r) => r.emoji === emojiType && r.my_reaction_id);
    if (existing?.my_reaction_id) {
      await removeMessageReaction(existing.my_reaction_id);
    } else {
      await addMessageReaction(message.id, emojiType);
    }
    onReactionUpdate?.();
  };

  const Bubble = isMine ? RightBubble : LeftBubble;

  const timestamp = (
    <Typo type="label-small" color="MEDIUM_GRAY">
      {format(date, 'h:mm aaa')}
    </Typo>
  );

  const bubbleContent = (
    <Layout.FlexCol style={{ position: 'relative' }}>
      {parent_preview && (
        <ParentPreview>
          <Typo type="label-small" color="MEDIUM_GRAY">
            {parent_preview.sender.username}
          </Typo>
          <Typo type="body-small" color="BLACK">
            {parent_preview.content ||
              (parent_preview.emoji && ChatEmojiDict[parent_preview.emoji as ChatEmojiType]) ||
              ''}
          </Typo>
        </ParentPreview>
      )}
      {showEmojiPicker && (
        <Layout.Absolute
          b="100%"
          style={{
            [isMine ? 'right' : 'left']: 0,
            marginBottom: 4,
            zIndex: 20,
          }}
        >
          <Layout.FlexRow
            gap={4}
            bgColor="WHITE"
            rounded={16}
            ph={8}
            pv={6}
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
          >
            {REACTION_EMOJIS.map((key) => {
              const isActive = reactions.some((r) => r.emoji === key && r.my_reaction_id);
              return (
                <Layout.FlexRow
                  key={key}
                  w={32}
                  h={32}
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer"
                  rounded={16}
                  onClick={() => handleEmojiReact(key)}
                  style={{ background: isActive ? '#E8E0F0' : 'transparent' }}
                >
                  <span style={{ fontSize: 18 }}>{ChatEmojiDict[key]}</span>
                </Layout.FlexRow>
              );
            })}
          </Layout.FlexRow>
        </Layout.Absolute>
      )}
      {shared_content_preview && <SharedContentCard preview={shared_content_preview} />}
      {message.image && (
        <>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
          <img
            src={message.image}
            alt="Shared"
            style={{
              maxWidth: 208,
              maxHeight: 200,
              borderRadius: 8,
              objectFit: 'cover',
              cursor: 'pointer',
            }}
            onClick={() => setShowImagePopup(true)}
            onDoubleClick={handleDoubleClick}
            onContextMenu={handleContextMenu}
          />
          {showImagePopup &&
            createPortal(
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
              <div
                onClick={() => setShowImagePopup(false)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '100%',
                  maxWidth: 500,
                  height: '100vh',
                  background: 'rgba(0,0,0,0.85)',
                  zIndex: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <img
                  src={message.image}
                  alt="Full size"
                  style={{
                    maxWidth: '90%',
                    maxHeight: '80vh',
                    objectFit: 'contain',
                  }}
                />
              </div>,
              document.body,
            )}
        </>
      )}
      {(content || emoji) && (
        <Bubble
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={handleDoubleClick}
          onContextMenu={handleContextMenu}
        >
          <Layout.FlexRow alignItems="center" justifyContent="center" gap={10}>
            {emoji && ChatEmojiDict[emoji as ChatEmojiType] && (
              <Typo type="body-medium">{ChatEmojiDict[emoji as ChatEmojiType]}</Typo>
            )}
            {content && (
              <Typo type="body-large" color="BLACK">
                {content}
              </Typo>
            )}
          </Layout.FlexRow>
        </Bubble>
      )}
      {reactions.length > 0 && (
        <Layout.FlexRow gap={4} mt={2} justifyContent={isMine ? 'flex-end' : 'flex-start'}>
          {reactions.map((r) => (
            <ReactionBadge key={r.emoji}>
              <Typo type="label-small">{ChatEmojiDict[r.emoji as ChatEmojiType] || r.emoji}</Typo>
              {r.count > 1 && (
                <Typo type="label-small" color="MEDIUM_GRAY">
                  {r.count}
                </Typo>
              )}
            </ReactionBadge>
          ))}
        </Layout.FlexRow>
      )}
    </Layout.FlexCol>
  );

  return (
    <>
      {show_date && (
        <Layout.FlexRow w="100%" justifyContent="center">
          <Typo type="label-medium" color="MEDIUM_GRAY">
            {format(date, 'y.M.d (E)')}
          </Typo>
        </Layout.FlexRow>
      )}
      {isMine ? (
        <RightMessageWrapper id={`msg_${message.id}`}>
          {timestamp}
          {bubbleContent}
        </RightMessageWrapper>
      ) : (
        <LeftMessageWrapper id={`msg_${message.id}`}>
          {bubbleContent}
          {timestamp}
        </LeftMessageWrapper>
      )}
    </>
  );
}

export default ChatMessageItem;
