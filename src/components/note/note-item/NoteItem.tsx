import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ContentTranslation from '@components/_common/content-translation/ContentTranslation';
import Icon from '@components/_common/icon/Icon';
import PostFooter from '@components/_common/post-footer/PostFooter';
import PostMoreModal from '@components/_common/post-more-modal/PostMoreModal';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import CommentBottomSheet from '@components/comments/comment-bottom-sheet/CommentBottomSheet';
import UpdatedLabel from '@components/friends/updated-label/UpdatedLabel';
import { Layout, Typo } from '@design-system';
import { Note, POST_DP_TYPE } from '@models/post';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import { NoteImage } from '../note-image/NoteImage.styled';

interface NoteItemProps {
  note: Note;
  isMyPage: boolean;
  commentType?: POST_DP_TYPE;
  refresh?: () => void;
}

function NoteItem({ note, isMyPage, commentType = 'LIST', refresh }: NoteItemProps) {
  const {
    content,
    created_at,
    id,
    author_detail,
    images,
    like_user_sample,
    like_reaction_user_sample,
    is_edited,
    current_user_read,
  } = note;

  const navigate = useNavigate();
  const [bottomSheet, setBottomSheet] = useState<boolean>(false);
  const [showMore, setShowMore] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);

  const { username, profile_image } = author_detail ?? {};
  const [t] = useTranslation('translation', { keyPrefix: 'notes' });

  const handleClickMore = (e: MouseEvent) => {
    e.stopPropagation();
    setShowMore(true);
  };

  const handleClickNote = () => {
    if (commentType === 'DETAIL') return;

    if (!isMyPage) {
      navigate(`./notes/${id}`);
      return;
    }

    return navigate(`/notes/${id}`);
  };

  const navigateToProfile = () => {
    navigate(`/users/${username}`);
  };

  // useEffect(() => {
  //   console.log('WHY', note, commentType);
  // });

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
              <Layout.FlexRow onClick={navigateToProfile}>
                <Typo type="title-medium" ellipsis={{ enabled: true, maxWidth: 140 }}>
                  {username}
                </Typo>
              </Layout.FlexRow>
              <Typo type="label-medium" color="MEDIUM_GRAY">
                {created_at && convertTimeDiffByString({ day: new Date(created_at) })}
              </Typo>
              {!current_user_read && <UpdatedLabel />}
            </Layout.FlexRow>
          </Layout.FlexRow>
          {/* 더보기 */}
          <Layout.FlexRow>
            <Icon name="dots_menu" size={24} onClick={handleClickMore} />
          </Layout.FlexRow>
        </Layout.FlexRow>
        <Layout.FlexCol>
          <ContentTranslation
            content={content}
            translateContent={!isMyPage && commentType === 'DETAIL'}
          />
          {/* 노트 이미지 - 1개만 노출 */}
          {images[0] && (
            <Layout.FlexRow w="100%" mv={10}>
              <NoteImage src={images[0]} />
            </Layout.FlexRow>
          )}
          {/* (수정됨) */}
          {is_edited && (
            <Typo type="label-medium" color="MEDIUM_GRAY">
              {`(${t('edited')})`}
            </Typo>
          )}
        </Layout.FlexCol>
        <PostFooter
          likedUserList={
            isMyPage && commentType !== 'DETAIL' ? like_reaction_user_sample : like_user_sample
          }
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
          setInputFocus={setInputFocus}
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
