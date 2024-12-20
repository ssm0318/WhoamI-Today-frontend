import { Layout } from '@design-system';
import EmojiItem from '../emoji-item/EmojiItem';
import Icon from '../icon/Icon';
import ProfileImage from '../profile-image/ProfileImage';

type PostReactionItemProps = {
  imageUrl: string | null;
  like: boolean;
  emoji: string | null;
  size?: number;
};

function PostReactionItem({ imageUrl, size = 23, like, emoji }: PostReactionItemProps) {
  return (
    <Layout.FlexRow
      style={{
        position: 'relative',
      }}
    >
      <ProfileImage imageUrl={imageUrl} size={23} />
      <Layout.Absolute r={like ? 0 : -3} b={like ? 2 : -6} z={2}>
        {like ? (
          <Icon name="like_filled" size={size / 3} />
        ) : (
          <EmojiItem
            emojiString={emoji || ''}
            size={size / 2}
            bgColor="TRANSPARENT"
            outline="TRANSPARENT"
          />
        )}
      </Layout.Absolute>
    </Layout.FlexRow>
  );
}

export default PostReactionItem;
