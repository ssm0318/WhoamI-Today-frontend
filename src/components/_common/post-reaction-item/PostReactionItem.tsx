import { Layout, SvgIcon } from '@design-system';
import EmojiItem from '../emoji-item/EmojiItem';
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
      <ProfileImage imageUrl={imageUrl} size={size} />
      <Layout.Absolute r={like ? -2 : -6} b={like ? -5 : -6} z={2}>
        {like ? (
          <SvgIcon name="noti_icon_like" size={size / 2} />
        ) : (
          <EmojiItem
            emojiString={emoji || ''}
            size={size / 1.8}
            bgColor="TRANSPARENT"
            outline="TRANSPARENT"
          />
        )}
      </Layout.Absolute>
    </Layout.FlexRow>
  );
}

export default PostReactionItem;
