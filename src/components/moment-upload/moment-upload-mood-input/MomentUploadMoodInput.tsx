import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@constants/layout';
import { Font, Layout, SvgIcon } from '@design-system';

interface MomentUploadMoodInputProps {
  mood: string | null;
  setMood: (mood: string) => void;
}

function MomentUploadMoodInput({ mood, setMood }: MomentUploadMoodInputProps) {
  const [emojiContent, setEmojiContent] = useState(mood || '');
  const [t] = useTranslation('translation', { keyPrefix: 'moment_upload' });

  const handleSelectEmoji = (emoji: EmojiClickData) => {
    setEmojiContent(emojiContent + emoji.emoji);
    setMood(emojiContent + emoji.emoji);
  };

  const [pickerVisible, setPickerVisible] = useState(false);

  const handleDeleteEmoji = (e: React.MouseEvent) => {
    // NOTE: 길이 2만큼 뒤에서 잘라줘야 제대로 하나의 emoji가 삭제됨
    const updatedEmoji = emojiContent.slice(0, -2);

    e.stopPropagation();

    setEmojiContent(updatedEmoji);
    setMood(updatedEmoji);
  };

  return (
    <>
      <Layout.FlexRow
        w="100%"
        alignItems="center"
        rounded={14}
        bgColor="BASIC_WHITE"
        pl={12}
        pr={emojiContent ? 24 : 12}
        pv={24}
        onClick={() => setPickerVisible(!pickerVisible)}
        style={{
          position: 'relative',
        }}
      >
        <SvgIcon name="moment_mood_normal" size={30} />
        {!emojiContent ? (
          <Font.Body type="18_regular" color="GRAY_12" ml={8}>
            {t('mood_placeholder')}
          </Font.Body>
        ) : (
          <Font.Body type="20_semibold" ml={8}>
            {emojiContent}
          </Font.Body>
        )}
        {emojiContent && (
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
