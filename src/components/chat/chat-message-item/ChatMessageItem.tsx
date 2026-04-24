import { format } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
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
  onImageLoad?: (messageId: number) => void;
}

function ChatMessageItem({ message, isMine, onReactionUpdate, onImageLoad }: Props) {
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
  const bubbleRef = useRef<HTMLDivElement>(null);
  const openedAtRef = useRef<number>(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pickerPos, setPickerPos] = useState<{ top: number; left: number } | null>(null);
  const [showImagePopup, setShowImagePopup] = useState(false);

  const POPUP_APPROX_HEIGHT = 52;
  const POPUP_APPROX_WIDTH = 220;
  const SUBHEADER_HEIGHT = 44;
  const EDGE_PADDING = 8;

  const openEmojiPicker = () => {
    const rect = bubbleRef.current?.getBoundingClientRect();
    if (!rect) return;
    const container = document.getElementById('main-scroll-container');
    const containerTop = container?.getBoundingClientRect().top ?? 0;
    const headerBottom = containerTop + SUBHEADER_HEIGHT;
    const spaceAbove = rect.top - headerBottom;
    const placeBelow = spaceAbove < POPUP_APPROX_HEIGHT + EDGE_PADDING;
    const top = placeBelow ? rect.bottom + 4 : rect.top - POPUP_APPROX_HEIGHT - 4;
    const viewportWidth = window.innerWidth;
    let left = isMine ? rect.right - POPUP_APPROX_WIDTH : rect.left;
    if (left < EDGE_PADDING) left = EDGE_PADDING;
    if (left + POPUP_APPROX_WIDTH > viewportWidth - EDGE_PADDING) {
      left = viewportWidth - POPUP_APPROX_WIDTH - EDGE_PADDING;
    }
    setPickerPos({ top, left });
    setShowEmojiPicker(true);
    openedAtRef.current = Date.now();
  };

  const closeEmojiPicker = () => {
    setShowEmojiPicker(false);
    setPickerPos(null);
  };

  const handleBackdropClick = () => {
    if (Date.now() - openedAtRef.current < 300) return;
    closeEmojiPicker();
  };

  useEffect(() => {
    if (!showEmojiPicker) return undefined;
    const container = document.getElementById('main-scroll-container');
    const onScroll = () => closeEmojiPicker();
    container?.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      container?.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onScroll);
    };
  }, [showEmojiPicker]);

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
      openEmojiPicker();
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
    if (showEmojiPicker) {
      closeEmojiPicker();
    } else {
      openEmojiPicker();
    }
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
    closeEmojiPicker();
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

  const hasImageAndText = Boolean(message.image && (content || emoji));

  const textBubble = (content || emoji) && (
    <Bubble
      ref={bubbleRef}
      mt={message.image ? 4 : 0}
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
  );

  const bubbleContent = (
    <Layout.FlexCol
      alignItems={isMine ? 'flex-end' : 'flex-start'}
      style={{ position: 'relative' }}
    >
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
      {showEmojiPicker &&
        pickerPos &&
        createPortal(
          <>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div
              onClick={handleBackdropClick}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9998,
              }}
            />
            <div
              style={{
                position: 'fixed',
                top: pickerPos.top,
                left: pickerPos.left,
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'row',
                gap: 4,
                background: 'white',
                borderRadius: 16,
                padding: '6px 8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              {REACTION_EMOJIS.map((key) => {
                const isActive = reactions.some((r) => r.emoji === key && r.my_reaction_id);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleEmojiReact(key)}
                    style={{
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 16,
                      border: 'none',
                      cursor: 'pointer',
                      background: isActive ? '#E8E0F0' : 'transparent',
                      padding: 0,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{ChatEmojiDict[key]}</span>
                  </button>
                );
              })}
            </div>
          </>,
          document.body,
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
            onLoad={() => onImageLoad?.(message.id)}
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
      {hasImageAndText ? (
        <Layout.FlexRow
          alignItems="flex-end"
          justifyContent={isMine ? 'flex-end' : 'flex-start'}
          gap={6}
        >
          {!isMine && timestamp}
          {textBubble}
          {isMine && timestamp}
        </Layout.FlexRow>
      ) : (
        textBubble
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
          {!hasImageAndText && timestamp}
          {bubbleContent}
        </RightMessageWrapper>
      ) : (
        <LeftMessageWrapper id={`msg_${message.id}`}>
          {bubbleContent}
          {!hasImageAndText && timestamp}
        </LeftMessageWrapper>
      )}
    </>
  );
}

export default ChatMessageItem;
