import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@constants/layout';
import { Layout, SvgIcon } from '@design-system';
import * as S from './MomentUploadMoodInput.styled';

interface MomentUploadMoodInputProps {
  mood: string | null;
  setMood: (mood: string | null) => void;
  disabled: boolean;
}

function MomentUploadMoodInput({ mood, setMood, disabled }: MomentUploadMoodInputProps) {
  // 현재 emoji content
  const [t] = useTranslation('translation', { keyPrefix: 'moment_upload' });

  const handleSelectEmoji = (emoji: EmojiClickData) => {
    setMood((mood || '') + emoji.emoji);
  };

  const [pickerVisible, setPickerVisible] = useState(false);

  const handleDeleteEmoji = (e: React.MouseEvent) => {
    // NOTE: 길이 2만큼 뒤에서 잘라줘야 제대로 하나의 emoji가 삭제됨
    const updatedEmoji = mood ? mood.slice(0, -2) : '';
    e.stopPropagation();

    // updatedEmoji가 빈 문자열이면 emojiContent, mood 모두 null로 변경
    if (updatedEmoji === '') {
      setMood(null);
      return;
    }
    setMood(updatedEmoji);
  };

  const toggleEmojiPicker = () => {
    if (disabled) return;
    setPickerVisible(!pickerVisible);
  };

  return (
    <>
      <Layout.FlexRow
        w="100%"
        alignItems="flex-start"
        rounded={14}
        bgColor="BASIC_WHITE"
        pl={12}
        pr={mood ? 24 : 12}
        pv={24}
        onClick={toggleEmojiPicker}
        style={{
          position: 'relative',
        }}
      >
        <SvgIcon name="moment_mood_normal" size={30} />
        <S.InputContainer
          placeholder={t('mood_placeholder') || ''}
          value={mood || ''}
          disabled={disabled || pickerVisible}
        />
        {/* 삭제 버튼 */}
        {!disabled && mood && (
          <Layout.Absolute r={12} b={24}>
            <button type="button" onClick={handleDeleteEmoji}>
              <SvgIcon name="delete_button" size={20} />
            </button>
          </Layout.Absolute>
        )}
      </Layout.FlexRow>
      {pickerVisible && (
        <Layout.Absolute b={0} l={0} z={5}>
          <EmojiPicker
            width={SCREEN_WIDTH}
            onEmojiClick={handleSelectEmoji}
            autoFocusSearch={false}
            searchDisabled
            height={SCREEN_HEIGHT / 2}
            previewConfig={{
              showPreview: false,
            }}
          />
        </Layout.Absolute>
      )}
    </>
  );
}

export default MomentUploadMoodInput;
