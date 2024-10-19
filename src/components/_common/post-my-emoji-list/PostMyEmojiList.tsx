import { Layout } from '@design-system';
import EmojiItem from '../emoji-item/EmojiItem';

type PostMyEmojiListProps = {
  emojiList: string[];
};

function PostMyEmojiList({ emojiList }: PostMyEmojiListProps) {
  return (
    <Layout.FlexRow alignItems="center">
      {emojiList.map((emoji, index) => (
        <Layout.FlexRow
          key={emoji}
          ml={index === 0 ? 0 : -12}
          z={emojiList.length - index}
          style={{
            position: 'relative',
          }}
        >
          <EmojiItem emojiString={emoji} size={24} />
        </Layout.FlexRow>
      ))}
    </Layout.FlexRow>
  );
}

export default PostMyEmojiList;
