import { MouseEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import PostFooter from '@components/_common/post-footer/PostFooter';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import CommentBottomSheet from '@components/comments/comment-bottom-sheet/CommentBottomSheet';
import { Layout, Typo } from '@design-system';
import { Note } from '@models/post';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import NoteImageList from '../note-image-list/NoteImageList';

interface NoteItemProps {
  note: Note;
  isMyPage: boolean;
  enableCollapse?: boolean;
  type?: 'LIST' | 'DETAIL';
}

function NoteItem({ note, isMyPage, enableCollapse = true, type = 'LIST' }: NoteItemProps) {
  const { content, created_at, id, author_detail, images, like_user_sample } = note;
  const navigate = useNavigate();
  const [overflowActive, setOverflowActive] = useState<boolean>(false);
  const [bottomSheet, setBottomSheet] = useState<boolean>(false);

  const { username, profile_image } = author_detail;
  const [t] = useTranslation('translation', { keyPrefix: 'notes' });

  const handleClickMore = (e: MouseEvent) => {
    e.stopPropagation();
    //
  };

  const handleClickNote = () => {
    if (type === 'DETAIL') return;
    return navigate(`/notes/${id}`);
  };

  useEffect(() => {
    if (content.length > MAX_NOTE_CONTENT_LENGTH) {
      setOverflowActive(true);
    }
  }, [content]);

  return (
    <>
      <Layout.FlexCol
        w="100%"
        p={12}
        gap={8}
        outline="LIGHT"
        rounded={12}
        onClick={handleClickNote}
      >
        <Layout.FlexRow
          w="100%"
          alignItems="center"
          justifyContent="space-between"
          h={PROFILE_IMAGE_SIZE}
        >
          <Layout.FlexRow w="100%" alignItems="center" gap={8}>
            <ProfileImage imageUrl={profile_image} username={username} size={PROFILE_IMAGE_SIZE} />
            {/* author, created_at 정보 */}
            <Layout.FlexRow alignItems="center" gap={8}>
              <Typo type="title-medium">{username}</Typo>
              <Typo type="label-medium" color="MEDIUM_GRAY">
                {convertTimeDiffByString({ day: new Date(created_at) })}
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
            {enableCollapse && overflowActive ? (
              <>
                {`${content.slice(0, MAX_NOTE_CONTENT_LENGTH)}...`}
                <Typo type="body-medium" color="BLACK" italic underline ml={3}>
                  {t('more')}
                </Typo>
              </>
            ) : (
              content
            )}
          </Typo>
          <Layout.FlexRow w="100%" mv={10}>
            <NoteImageList images={images} />
          </Layout.FlexRow>
        </Layout.FlexCol>
        <PostFooter
          likedUserList={like_user_sample}
          isMyPage={isMyPage}
          post={note}
          showComments={() => setBottomSheet(true)}
        />
      </Layout.FlexCol>
      {bottomSheet && (
        <CommentBottomSheet
          postType="Note"
          post={note}
          visible={bottomSheet}
          closeBottomSheet={() => setBottomSheet(false)}
        />
      )}
    </>
  );
}

export default NoteItem;

const PROFILE_IMAGE_SIZE = 44;
const MAX_NOTE_CONTENT_LENGTH = 140;
