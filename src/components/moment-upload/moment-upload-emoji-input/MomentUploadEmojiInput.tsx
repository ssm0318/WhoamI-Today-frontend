import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import React, { useState } from 'react';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@constants/layout';
import { Font, Layout, SvgIcon } from '@design-system';

interface MomentUploadEmojiInputProps {
  setInput: (input: string) => void;
  placeholder?: string;
}

function MomentUploadEmojiInput({ setInput, placeholder }: MomentUploadEmojiInputProps) {
  const [emojiContent, setEmojiContent] = useState('');

  const handleSelectEmoji = (emoji: EmojiClickData) => {
    setEmojiContent(emojiContent + emoji.emoji);
    setInput(emojiContent + emoji.emoji);
  };

  const [pickerVisible, setPickerVisible] = useState(false);

  const handleDeleteEmoji = (e: React.MouseEvent) => {
    // NOTE: 길이 2만큼 뒤에서 잘라줘야 제대로 하나의 emoji가 삭제됨
    const updatedEmoji = emojiContent.slice(0, -2);

    e.stopPropagation();

    setEmojiContent(updatedEmoji);
    setInput(updatedEmoji);
  };

  return (
    <>
      <Layout.FlexRow
        h={SCREEN_WIDTH}
        w="100%"
        bgColor="BASIC_WHITE"
        rounded={14}
        p={30}
        onClick={() => setPickerVisible(!pickerVisible)}
      >
        <Layout.FlexRow
          w="100%"
          style={{
            position: 'relative',
          }}
        >
          {!emojiContent ? (
            <>
              <Layout.FlexRow bgColor="RESPONSE_INPUT_DIVIDER" h={18} w={1} mr={12} />
              <Font.Body type="18_regular" color="GRAY_9">
                {placeholder}
              </Font.Body>
            </>
          ) : (
            <Font.Body type="20_semibold">{emojiContent}</Font.Body>
          )}
          {emojiContent && (
            <Layout.Absolute r={10} b={-30}>
              <button type="button" onClick={handleDeleteEmoji}>
                <SvgIcon name="delete_button" size={20} />
              </button>
            </Layout.Absolute>
          )}
        </Layout.FlexRow>
      </Layout.FlexRow>
      {pickerVisible && (
        <Layout.Absolute b={0} z={5}>
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

export default MomentUploadEmojiInput;
