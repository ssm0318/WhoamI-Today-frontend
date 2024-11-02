import { Layout } from '@design-system';
import { ReactionUserSample } from '@models/post';
import PostReactionItem from '../post-reaction-item/PostReactionItem';

type PostReactionListProps = {
  user_sample_list: ReactionUserSample[];
};

function PostReactionList({ user_sample_list }: PostReactionListProps) {
  return (
    <Layout.FlexRow alignItems="center">
      {user_sample_list.slice(0, COUNT).map((user, index) => {
        const key = `image${index}`;
        return (
          <Layout.FlexRow
            key={key}
            ml={index === 0 ? 0 : -(SIZE - 10)}
            z={COUNT - index}
            style={{
              position: 'relative',
            }}
          >
            <PostReactionItem
              imageUrl={user.profile_image}
              size={SIZE}
              like={user.like}
              emoji={user.reaction}
            />
          </Layout.FlexRow>
        );
      })}
    </Layout.FlexRow>
  );
}

const SIZE = 25;
const COUNT = 3;

export default PostReactionList;
