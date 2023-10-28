import { Emoji } from 'emoji-picker-react';
import { Layout } from '@design-system';

interface EmojiItemProps {
  z?: number;
  emojiString: string;
  size: number;
  ml?: number;
}

function EmojiItem({ z, emojiString, size, ml }: EmojiItemProps) {
  return (
    <Layout.FlexRow
      z={z}
      ml={ml}
      outline="BACKGROUND_COLOR"
      rounded={14}
      p={2}
      bgColor="BASIC_WHITE"
    >
      <Emoji unified={emojiString.codePointAt(0)?.toString(16) || ''} size={size} />
    </Layout.FlexRow>
  );
}

export default EmojiItem;
