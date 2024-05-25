import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const [t] = useTranslation('translation', {
    keyPrefix: post.type === POST_TYPE.RESPONSE ? 'responses' : 'notes',
  });

  const handleClickComment = (e: MouseEvent) => {
    e.stopPropagation();
    showComments();
  };

  const handleClickLikes = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(type === 'Response' ? `/responses/${post.id}/likes` : `/notes/${post.id}/likes`);
  };

  return (
    <Layout.FlexCol gap={8}>
      <Layout.FlexRow gap={16} alignItems="center">
        {isMyPage ? (
          <button type="button" onClick={handleClickLikes}>
            <ProfileImageList images={likedUserList.map((user) => user.profile_image)} />
          </button>
        ) : (
          <LikeButton postType={type} post={post} iconSize={23} m={0} />
        )}
        <Icon name="add_comment" size={23} onClick={handleClickComment} />
      </Layout.FlexRow>

      {!!comment_count && (
        <Layout.FlexRow>
          <button type="button" onClick={handleClickComment}>
            <Typo type="label-large" color="BLACK" underline>
              {comment_count || 0} {t('comments')}
            </Typo>
          </button>
        </Layout.FlexRow>
      )}
    </Layout.FlexCol>
  );
}

export default PostFooter;
