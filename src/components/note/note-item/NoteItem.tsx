import { MouseEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import PostFooter from '@components/_common/post-footer/PostFooter';
import PostMoreModal from '@components/_common/post-more-modal/PostMoreModal';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import CommentBottomSheet from '@components/comments/comment-bottom-sheet/CommentBottomSheet';
import { Layout, Typo } from '@design-system';
import { Note } from '@models/post';
import { isUpdated } from '@utils/isUpdatedPost';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import NoteImageList from '../note-image-list/NoteImageList';

interface NoteItemProps {
  note: Note;
  isMyPage: boolean;
  commentType?: 'LIST' | 'DETAIL';
  refresh?: () => Promise<void>;
}

function NoteItem({ note, isMyPage, commentType = 'LIST', refresh }: NoteItemProps) {
  const { content, created_at, id, author_detail, images, like_user_sample, updated_at } = note;
  const navigate = useNavigate();
  const [bottomSheet, setBottomSheet] = useState<boolean>(false);
  const [showMore, setShowMore] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);

  const { username, profile_image } = author_detail ?? {};
  const [t] = useTranslation('translation', { keyPrefix: 'notes' });

  const commentRef = useRef<HTMLTextAreaElement>(null);

  const handleClickMore = (e: MouseEvent) => {
    e.stopPropagation();
    setShowMore(true);
  };

  const handleClickNote = () => {
    if (commentType === 'DETAIL') return;
    return navigate(`/notes/${id}`);
  };

  const navigateToProfile = () => {
    navigate(`/users/${username}`);
  };

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
        <PostMoreModal
          isVisible={showMore}
          setIsVisible={setShowMore}
          post={note}
          isMyPage={isMyPage}
          onConfirmReport={refresh}
        />
        <Layout.FlexRow
          w="100%"
          alignItems="center"
          justifyContent="space-between"
          h={PROFILE_IMAGE_SIZE}
        >
          <Layout.FlexRow w="100%" alignItems="center" gap={8}>
            <ProfileImage
              imageUrl={profile_image}
              username={username}
              size={PROFILE_IMAGE_SIZE}
              onClick={navigateToProfile}
            />
            {/* author, created_at 정보 */}
            <Layout.FlexRow alignItems="center" gap={8}>
              <Typo type="title-medium">{username}</Typo>
              <Typo type="label-medium" color="MEDIUM_GRAY">
                {created_at && convertTimeDiffByString({ day: new Date(created_at) })}
              </Typo>
            </Layout.FlexRow>
          </Layout.FlexRow>
          {/* 더보기 */}
          <Layout.FlexRow>
            <Icon name="dots_menu" size={24} onClick={handleClickMore} />
          </Layout.FlexRow>
        </Layout.FlexRow>
        <Layout.FlexCol>
          <Typo type="body-large" color="BLACK" pre>
            {content}
          </Typo>
          {/* 이미지 */}
          <NoteImageList images={images} />
          {/* (수정됨) */}
          {isUpdated(created_at, updated_at) && (
            <Typo type="label-medium" color="MEDIUM_GRAY">
              {`(${t('edited')})`}
            </Typo>
          )}
        </Layout.FlexCol>
        <PostFooter
          likedUserList={like_user_sample}
          isMyPage={isMyPage}
          post={note}
          showComments={() => setBottomSheet(true)}
          setInputFocus={() => setInputFocus(true)}
          commentType={commentType}
        />
      </Layout.FlexCol>
      {bottomSheet && (
        <CommentBottomSheet
          postType="Note"
          post={note}
          visible={bottomSheet}
          inputFocus={inputFocus}
          commentRef={commentRef}
          closeBottomSheet={() => {
            setBottomSheet(false);
            setInputFocus(false);
          }}
        />
      )}
    </>
  );
}

export default NoteItem;

const PROFILE_IMAGE_SIZE = 44;
