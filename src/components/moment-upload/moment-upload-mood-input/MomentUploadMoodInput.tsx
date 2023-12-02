import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layout, SvgIcon } from '@design-system';
import * as S from './MomentUploadMoodInput.styled';

interface MomentUploadMoodInputProps {
  mood: string | null;
  setMood: (mood: string | null) => void;
  disabled: boolean;
  isEmojiPickerVisible: boolean;
  setIsEmojiPickerVisible: (visible: boolean) => void;
}

function MomentUploadMoodInput({
  mood,
  setMood,
  disabled,
  isEmojiPickerVisible,
  setIsEmojiPickerVisible,
}: MomentUploadMoodInputProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'moment_upload' });

  const handleDeleteEmoji = (e: React.MouseEvent) => {
    // NOTE: 길이 2만큼 뒤에서 잘라줘야 제대로 하나의 emoji가 삭제됨
    const updatedEmoji = mood ? mood.slice(0, -2) : '';
    e.stopPropagation();

    if (updatedEmoji === '') {
      setMood(null);
      return;
    }
    setMood(updatedEmoji);
  };

  const toggleEmojiPicker = () => {
    if (disabled) return;
    setIsEmojiPickerVisible(!isEmojiPickerVisible);
  };

  return (
    <Layout.FlexRow
      w="100%"
      alignItems="flex-start"
      rounded={14}
      bgColor="WHITE"
      pl={12}
      pr={mood ? 24 : 12}
      pv={24}
      onClick={toggleEmojiPicker}
      style={{
        position: 'relative',
      }}
    >
      <SvgIcon name="moment_mood_normal" size={30} />
      <S.InputContainer placeholder={t('mood_placeholder') || ''} value={mood || ''} disabled />
      {/* 삭제 버튼 */}
      {!disabled && mood && (
        <Layout.Absolute r={12} b={24} p={4}>
          <button type="button" onClick={handleDeleteEmoji}>
            <SvgIcon name="delete_default" size={20} />
          </button>
        </Layout.Absolute>
      )}
    </Layout.FlexRow>
  );
}

export default MomentUploadMoodInput;
