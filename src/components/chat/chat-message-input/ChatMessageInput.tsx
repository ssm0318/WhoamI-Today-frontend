import { AxiosError } from 'axios';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import CommonDialog from '@components/_common/alert-dialog/common-dialog/CommonDialog';
import Icon from '@components/_common/icon/Icon';
import { BOTTOM_TABBAR_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import {
  ChatEmojiDict,
  ChatEmojiType,
  ChatMessage,
  InputChatMessage,
  PostChatMessageRes,
} from '@models/chat';
import { useBoundStore } from '@stores/useBoundStore';
import { postChatMessage, postGroupMessage } from '@utils/apis/chat';

const StyledTextarea = styled.textarea`
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  resize: none;
  min-height: 20px;
  max-height: 120px;
  font-family: inherit;
  line-height: 1.4;
  overflow-y: auto;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ImagePreviewWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin: 4px 0;
`;

const PreviewImage = styled.img`
  max-height: 80px;
  max-width: 150px;
  border-radius: 8px;
  object-fit: cover;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #333;
  color: white;
  border: none;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

interface Props {
  userId: number;
  replyTarget: ChatMessage | null;
  onClearReply: () => void;
  onMessageSent: (msg: PostChatMessageRes) => void;
  onTyping?: () => void;
  isGroup?: boolean;
  typingText?: string | null;
  isAnnouncement?: boolean;
}

const TYPING_DEBOUNCE_MS = 2000;
const MAX_HEIGHT_DEFAULT = 120;
const MAX_HEIGHT_ANNOUNCEMENT = 360;

function ChatMessageInput({
  userId,
  replyTarget,
  onClearReply,
  onMessageSent,
  onTyping,
  isGroup,
  typingText,
  isAnnouncement,
}: Props) {
  const [inputValue, setInputValue] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showAnnouncementConfirm, setShowAnnouncementConfirm] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const lastTypingSent = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));
  const [t] = useTranslation('translation', { keyPrefix: 'chat' });

  const maxHeight = isAnnouncement ? MAX_HEIGHT_ANNOUNCEMENT : MAX_HEIGHT_DEFAULT;

  // Auto-expand textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    }
  }, [inputValue, maxHeight]);

  // Auto-focus textarea when reply target is set
  useEffect(() => {
    if (replyTarget) {
      textareaRef.current?.focus();
    }
  }, [replyTarget]);

  const handleChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (onTyping) {
      const now = Date.now();
      if (now - lastTypingSent.current > TYPING_DEBOUNCE_MS) {
        lastTypingSent.current = now;
        onTyping();
      }
    }
  };

  const handleKeyDownInput = (e: KeyboardEvent) => {
    if (e.nativeEvent.isComposing || e.key !== 'Enter') return;
    if (e.shiftKey) return;
    if (isAnnouncement) return; // Announcements require an explicit Post button — Enter inserts newline.
    e.preventDefault();
    sendMessage();
  };

  const handleAnnouncementPostClick = () => {
    if (!inputValue.trim() && !selectedImage) return;
    setShowAnnouncementConfirm(true);
  };

  const handleAnnouncementConfirm = () => {
    setShowAnnouncementConfirm(false);
    sendMessage();
  };

  const sendMessage = async () => {
    if (isSending) return;
    if (!inputValue.trim() && !selectedImage) return;

    const msg: InputChatMessage = {
      emoji: null,
      content: inputValue.trim(),
    };

    if (replyTarget) {
      msg.parent = replyTarget.id;
    }

    setIsSending(true);
    try {
      const { data } = isGroup
        ? await postGroupMessage(userId, msg, selectedImage || undefined)
        : await postChatMessage(userId, msg, selectedImage || undefined);
      onMessageSent(data);
      setInputValue('');
      setSelectedImage(null);
      setImagePreview(null);
      onClearReply();
    } catch (err) {
      const axiosErr = err as AxiosError<{ detail?: string }>;
      const status = axiosErr?.response?.status;
      if (status === 403) {
        openToast({ message: t('send_blocked') });
      } else {
        openToast({ message: t('send_failed') });
      }
    } finally {
      setIsSending(false);
    }
  };

  // Image selection
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  return (
    <Layout.Fixed
      b={BOTTOM_TABBAR_HEIGHT}
      z={10}
      style={{
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 500,
      }}
    >
      {typingText && (
        <Layout.FlexRow
          w="100%"
          pl={17}
          pv={4}
          bgColor="WHITE"
          style={{ borderTop: '1px solid #D9D9D9' }}
        >
          <Typo type="body-small" color="MEDIUM_GRAY">
            {typingText}
          </Typo>
        </Layout.FlexRow>
      )}
      {replyTarget && (
        <Layout.FlexRow
          w="100%"
          ph={14}
          pv={6}
          bgColor="LIGHT"
          alignItems="center"
          justifyContent="space-between"
          style={{ borderTop: '1px solid #D9D9D9' }}
        >
          <Layout.FlexCol style={{ flex: 1, minWidth: 0 }}>
            <Typo type="label-small" color="MEDIUM_GRAY">
              Replying to {replyTarget.sender.username}
            </Typo>
            <Typo type="body-small" color="BLACK">
              {replyTarget.content ||
                (replyTarget.emoji && ChatEmojiDict[replyTarget.emoji as ChatEmojiType]) ||
                ''}
            </Typo>
          </Layout.FlexCol>
          <Icon name="close" size={16} onClick={onClearReply} />
        </Layout.FlexRow>
      )}
      <Layout.FlexCol
        w="100%"
        ph={14}
        pv={10}
        bgColor="WHITE"
        style={{
          borderTop: '1px solid #D9D9D9',
          position: 'relative',
        }}
      >
        {/* Image preview */}
        {imagePreview && (
          <ImagePreviewWrapper>
            <PreviewImage src={imagePreview} alt="Selected" />
            <RemoveButton type="button" onClick={removeImage}>
              ✕
            </RemoveButton>
          </ImagePreviewWrapper>
        )}
        <Layout.FlexRow w="100%" alignItems="flex-end" gap={8}>
          <Icon name="chat_media_image" size={24} fill="DARK_GRAY" onClick={handleImageClick} />
          <HiddenFileInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <StyledTextarea
            ref={textareaRef}
            value={inputValue}
            placeholder={
              isAnnouncement ? 'Compose announcement to all users...' : 'Send a message...'
            }
            onChange={handleChangeInput}
            onKeyDown={handleKeyDownInput}
            rows={isAnnouncement ? 4 : 1}
            style={{ maxHeight: `${maxHeight}px` }}
          />
          {!isAnnouncement && (inputValue.trim() || selectedImage) && (
            <Icon
              name="question_send"
              size={24}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => sendMessage()}
              color="PRIMARY"
            />
          )}
        </Layout.FlexRow>
        {isAnnouncement && (
          <Layout.FlexRow w="100%" pt={10} justifyContent="flex-end">
            <button
              type="button"
              onClick={handleAnnouncementPostClick}
              disabled={!inputValue.trim() && !selectedImage}
              style={{
                padding: '8px 20px',
                background: !inputValue.trim() && !selectedImage ? '#D9D9D9' : '#8700FF',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: !inputValue.trim() && !selectedImage ? 'not-allowed' : 'pointer',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Post Announcement
            </button>
          </Layout.FlexRow>
        )}
      </Layout.FlexCol>
      {isAnnouncement && (
        <CommonDialog
          visible={showAnnouncementConfirm}
          title="Send announcement?"
          content="This will be delivered to every user as a message from WIT Admin and cannot be undone."
          cancelText="Cancel"
          confirmText="Send to all"
          confirmTextColor="PRIMARY"
          onClickConfirm={handleAnnouncementConfirm}
          onClickClose={() => setShowAnnouncementConfirm(false)}
        />
      )}
    </Layout.Fixed>
  );
}

export default ChatMessageInput;
