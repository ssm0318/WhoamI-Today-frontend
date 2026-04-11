import EmojiPicker, {
  Categories,
  EmojiClickData,
  EmojiStyle,
  SkinTonePickerLocation,
  SuggestionMode,
} from 'emoji-picker-react';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
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
import { postChatMessage, postGroupMessage } from '@utils/apis/chat';

const EmojiPickerWrapper = styled.div`
  .EmojiPickerReact .epr-header {
    padding: 4px 6px 0 !important;
    min-height: 0 !important;
  }
  .EmojiPickerReact .epr-search-container {
    padding: 0 !important;
  }
  .EmojiPickerReact .epr-search-container input {
    height: 32px !important;
    font-size: 12px !important;
  }
  .EmojiPickerReact .epr-search-container .epr-icn-search {
    top: 50% !important;
    transform: translateY(-50%) !important;
  }
  .EmojiPickerReact .epr-category-nav {
    display: flex !important;
    padding: 2px 0 !important;
    min-height: 0 !important;
  }
  .EmojiPickerReact .epr-category-nav button {
    padding: 2px 4px !important;
  }
  .EmojiPickerReact .epr-body {
    padding: 0 2px !important;
  }
  .EmojiPickerReact li.epr-emoji-category > .epr-emoji-category-label,
  .EmojiPickerReact .epr-emoji-category > .epr-emoji-category-label {
    display: flex !important;
    font-size: 11px !important;
    font-weight: 600 !important;
    padding: 2px 6px !important;
    margin: 0 !important;
    height: auto !important;
    min-height: 0 !important;
    line-height: 1.4 !important;
  }
  .EmojiPickerReact button.epr-emoji {
    padding: 2px !important;
  }
`;

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
}

const TYPING_DEBOUNCE_MS = 2000;

function ChatMessageInput({
  userId,
  replyTarget,
  onClearReply,
  onMessageSent,
  onTyping,
  isGroup,
}: Props) {
  const [inputValue, setInputValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const lastTypingSent = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-expand textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

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
    e.preventDefault();
    sendMessage();
  };

  const sendMessage = async () => {
    if (!inputValue.trim() && !selectedImage) return;

    const msg: InputChatMessage = {
      emoji: null,
      content: inputValue.trim(),
    };

    if (replyTarget) {
      msg.parent = replyTarget.id;
    }

    try {
      const { data } = isGroup
        ? await postGroupMessage(userId, msg, selectedImage || undefined)
        : await postChatMessage(userId, msg, selectedImage || undefined);
      onMessageSent(data);
      setInputValue('');
      setSelectedImage(null);
      setImagePreview(null);
      onClearReply();
      setShowEmojiPicker(false);
    } catch (err) {
      console.error('[ChatMessageInput] send failed:', err);
    }
  };

  // Full emoji picker: insert emoji character into text
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInputValue((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
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
        {/* Emoji picker rendered via portal to avoid overflow clipping */}
        {showEmojiPicker &&
          createPortal(
            <div
              style={{
                position: 'fixed',
                bottom: BOTTOM_TABBAR_HEIGHT + 52,
                left: '50%',
                transform: 'translateX(-50%)',
                maxWidth: 500,
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
                paddingRight: 8,
                zIndex: 50,
              }}
            >
              <EmojiPickerWrapper>
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  height={320}
                  width={350}
                  searchPlaceHolder="Search emoji..."
                  skinTonesDisabled={false}
                  skinTonePickerLocation={SkinTonePickerLocation.SEARCH}
                  suggestedEmojisMode={SuggestionMode.RECENT}
                  emojiStyle={EmojiStyle.APPLE}
                  categories={[
                    { category: Categories.SUGGESTED, name: 'Recently Used' },
                    { category: Categories.SMILEYS_PEOPLE, name: 'Smileys & People' },
                    { category: Categories.ANIMALS_NATURE, name: 'Animals & Nature' },
                    { category: Categories.FOOD_DRINK, name: 'Food & Drink' },
                    { category: Categories.TRAVEL_PLACES, name: 'Travel & Places' },
                    { category: Categories.ACTIVITIES, name: 'Activities' },
                    { category: Categories.OBJECTS, name: 'Objects' },
                    { category: Categories.SYMBOLS, name: 'Symbols' },
                    { category: Categories.FLAGS, name: 'Flags' },
                  ]}
                  previewConfig={{ showPreview: false }}
                />
              </EmojiPickerWrapper>
            </div>,
            document.body,
          )}
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
            placeholder="Send a message..."
            onChange={handleChangeInput}
            onKeyDown={handleKeyDownInput}
            rows={1}
          />
          <Icon
            name="emoji"
            size={24}
            fill="DARK_GRAY"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          />
          {(inputValue.trim() || selectedImage) && (
            <Icon name="question_send" size={24} onClick={() => sendMessage()} color="PRIMARY" />
          )}
        </Layout.FlexRow>
      </Layout.FlexCol>
    </Layout.Fixed>
  );
}

export default ChatMessageInput;
