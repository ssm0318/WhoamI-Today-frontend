import { Emoji } from 'emoji-picker-react';
import { ColorKeys, Layout } from '@design-system';

interface EmojiItemProps {
  z?: number;
  emojiString: string;
  size: number;
  ml?: number;
  bgColor?: ColorKeys;
  outline?: ColorKeys;
}

function EmojiItem({
  z,
  emojiString,
  size,
  ml,
  bgColor = 'BASIC_WHITE',
  outline = 'BACKGROUND_COLOR',
}: EmojiItemProps) {
  return (
    <Layout.FlexRow z={z} ml={ml} outline={outline} rounded={14} p={2} bgColor={bgColor}>
      <Emoji unified={emojiString.codePointAt(0)?.toString(16) || ''} size={size} />
    </Layout.FlexRow>
  );
}

export default EmojiItem;
