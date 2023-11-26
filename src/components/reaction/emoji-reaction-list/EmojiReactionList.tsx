import { Font, Layout } from '@design-system';
import EmojiItem from '../../_common/emoji-item/EmojiItem';

interface EmojiReactionListProps {
  emojis: string[];
}

function EmojiReactionList({ emojis }: EmojiReactionListProps) {
  return (
    <Layout.FlexRow>
      {emojis.length > REACTION_EMOJI_COUNT ? (
        <Layout.FlexRow alignItems="center">
          {emojis.slice(0, 3).map((e, index) => (
            <EmojiItem emojiString={e} z={REACTION_EMOJI_COUNT - index} key={e} size={16} ml={-8} />
          ))}
          <Font.Display type="18_bold" mh={2}>
            ...
          </Font.Display>
          <EmojiItem emojiString={emojis[emojis.length - 1]} size={16} />
        </Layout.FlexRow>
      ) : (
        <>
          {emojis.map((e, index) => (
            <EmojiItem emojiString={e} z={REACTION_EMOJI_COUNT - index} key={e} size={16} ml={-8} />
          ))}
        </>
      )}
    </Layout.FlexRow>
  );
}

export const REACTION_EMOJI_COUNT = 5;

export default EmojiReactionList;
