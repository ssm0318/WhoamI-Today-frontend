import { useTranslation } from 'react-i18next';
import { Layout, Typo } from '@design-system';
import { Note, POST_TYPE, Response } from '@models/post';
import { User } from '@models/user';
import Icon from '../icon/Icon';
import LikeButton from '../like-button/LikeButton';
import ProfileImageList from '../profile-image-list/ProfileImageList';

type PostFooterProps = {
  likedUserList: User[];
  isMyPage: boolean;
  post: Response | Note;
  showComments: () => void;
};

function PostFooter({ likedUserList, isMyPage, post, showComments }: PostFooterProps) {
  const { comment_count, type } = post;

  const [t] = useTranslation('translation', {
    keyPrefix: post.type === POST_TYPE.RESPONSE ? 'responses' : 'notes',
  });

  const handleClickComment = () => {
    // TODO
    console.log('comment');
  };

  return (
    <Layout.FlexCol gap={8}>
      <Layout.FlexRow gap={16} alignItems="center">
        {isMyPage ? (
          <ProfileImageList images={likedUserList.map((user) => user.profile_image)} />
        ) : (
          <LikeButton postType={type} post={post} iconSize={23} m={0} />
        )}
        <Icon name="add_comment" size={23} onClick={handleClickComment} />
      </Layout.FlexRow>

      {/* temporal: comment_count not showing */}
      <Icon
        name="star"
        size={23}
        onClick={(e) => {
          e.stopPropagation();
          showComments();
        }}
      />

      {!!comment_count && (
        <Layout.FlexRow>
          <Typo type="label-large" color="BLACK" underline>
            {comment_count || 0} {t('comments')}
          </Typo>
        </Layout.FlexRow>
      )}
    </Layout.FlexCol>
  );
}

export default PostFooter;
