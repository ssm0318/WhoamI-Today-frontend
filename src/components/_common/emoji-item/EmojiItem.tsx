import { Emoji } from 'emoji-picker-react';
import { ColorKeys, Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { getUnifiedEmoji } from '@utils/emojiHelpers';

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
  bgColor = 'WHITE',
  outline = 'BACKGROUND_COLOR',
}: EmojiItemProps) {
  const { featureFlags } = useBoundStore(UserSelector);

  return (
    <Layout.FlexRow z={z} ml={ml} outline={outline} rounded={14} p={2} bgColor={bgColor}>
      {featureFlags?.friendList ? (
        <Emoji unified={getUnifiedEmoji(emojiString)} size={size} lazyLoad />
      ) : (
        <Emoji unified={emojiString.codePointAt(0)?.toString(16) || ''} size={size} />
      )}
    </Layout.FlexRow>
  );
}

export default EmojiItem;
