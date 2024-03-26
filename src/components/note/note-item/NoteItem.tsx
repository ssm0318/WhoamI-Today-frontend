import { MouseEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getAuthorProfileInfo } from '@components/_common/author-profile/AuthorProfile.helper';
import Icon from '@components/_common/icon/Icon';
import LikeButton from '@components/_common/like-button/LikeButton';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Layout, Typo } from '@design-system';
import { Note } from '@models/post';
import { convertTimeDiffByString } from '@utils/timeHelpers';

interface NoteItemProps {
  note: Note;
  isMyPage?: boolean;
}

function NoteItem({ note, isMyPage }: NoteItemProps) {
  const { content, created_at, id, comment_count, author_detail } = note;
  const navigate = useNavigate();
  const [t] = useTranslation('translation', { keyPrefix: 'responses' });
  const [overflowActive, setOverflowActive] = useState<boolean>(false);
  const { username, imageUrl } = getAuthorProfileInfo(author_detail);
  const handleClickMore = (e: MouseEvent) => {
    e.stopPropagation();
    //
  };

  const handleClickNote = () => {
    return navigate(`/notes/${id}`);
  };

  const handleClickComment = (e: MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    if (content.length > MAX_NOTE_CONTENT_LENGTH) {
      setOverflowActive(true);
    }
  }, [content]);

  return (
    <Layout.FlexCol w="100%" p={12} gap={8} outline="LIGHT" rounded={12} onClick={handleClickNote}>
      <Layout.FlexRow
        w="100%"
        alignItems="center"
        justifyContent="space-between"
        h={PROFILE_IMAGE_SIZE}
      >
        <Layout.FlexRow w="100%" alignItems="center" gap={8}>
          <ProfileImage imageUrl={imageUrl} username={username} size={PROFILE_IMAGE_SIZE} />
          {/* author, created_at 정보 */}
          <Layout.FlexRow alignItems="center" gap={8}>
            <Typo type="title-medium">{username}</Typo>
            <Typo type="label-medium" color="MEDIUM_GRAY">
              {convertTimeDiffByString(new Date(), new Date(created_at))}
            </Typo>
          </Layout.FlexRow>
        </Layout.FlexRow>
        {/* 더보기 */}
        <Layout.FlexRow>
          <Icon name="dots_menu" size={24} onClick={handleClickMore} />
        </Layout.FlexRow>
      </Layout.FlexRow>
      <Layout.FlexCol>
        <Typo type="body-large" color="BLACK">
          {overflowActive ? (
            <>
              {`${content.slice(0, MAX_NOTE_CONTENT_LENGTH)}...`}
              <Typo type="body-medium" color="BLACK" italic underline ml={3}>
                more
              </Typo>
            </>
          ) : (
            content
          )}
        </Typo>
      </Layout.FlexCol>
      <Layout.FlexCol gap={8}>
        <Layout.FlexRow gap={16} alignItems="center">
          {isMyPage ? (
            <Layout.FlexRow>{/* TODO 좋아요 누른 사람들 profile */}</Layout.FlexRow>
          ) : (
            <LikeButton postType="Note" post={note} iconSize={24} m={0} />
          )}
          <Icon name="add_comment" size={24} onClick={handleClickComment} />
        </Layout.FlexRow>
        <Layout.FlexRow>
          <Typo type="label-large" color="BLACK" underline>
            {comment_count || 0} {t('comments')}
          </Typo>
        </Layout.FlexRow>
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

export default NoteItem;

const PROFILE_IMAGE_SIZE = 44;
const MAX_NOTE_CONTENT_LENGTH = 140;
