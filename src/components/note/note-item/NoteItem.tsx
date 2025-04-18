import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ContentTranslation from '@components/_common/content-translation/ContentTranslation';
import Icon from '@components/_common/icon/Icon';
import PostFooter from '@components/_common/post-footer/PostFooter';
import PostFooterDefault from '@components/_common/post-footer/PostFooterDefault';
import PostMoreModal from '@components/_common/post-more-modal/PostMoreModal';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import CommentBottomSheet from '@components/comments/comment-bottom-sheet/CommentBottomSheet';
import UpdatedLabel from '@components/friends/updated-label/UpdatedLabel';
import { Layout, Typo } from '@design-system';
import { Note, POST_DP_TYPE } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import { NoteImage } from '../note-image/NoteImage.styled';

interface NoteItemProps {
  note: Note;
  isMyPage: boolean;
  displayType?: POST_DP_TYPE;
  refresh?: () => void;
}

function NoteItem({ note, isMyPage, displayType = 'LIST', refresh }: NoteItemProps) {
  const {
    content,
    created_at,
    id,
    author_detail,
    images,
    like_user_sample,
    is_edited,
    current_user_read,
    visibility,
  } = note;
  const navigate = useNavigate();
  const { featureFlags } = useBoundStore(UserSelector);

  const [bottomSheet, setBottomSheet] = useState<boolean>(false);
  const [showMore, setShowMore] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);

  const { emojiPickerTarget, setEmojiPickerTarget } = useBoundStore((state) => ({
    emojiPickerTarget: state.emojiPickerTarget,
    setEmojiPickerTarget: state.setEmojiPickerTarget,
  }));

  const { username, profile_image } = author_detail ?? {};
  const [t] = useTranslation('translation', { keyPrefix: 'notes' });

  const handleClickMore = (e: MouseEvent) => {
    e.stopPropagation();
    setShowMore(true);
  };

  const handleClickNote = (e: MouseEvent) => {
    if (featureFlags?.friendList) {
      if (emojiPickerTarget) {
        return setEmojiPickerTarget(null);
      }

      e.stopPropagation();
    }

    if (displayType === 'DETAIL') return;

    if (!isMyPage) {
      navigate(`./notes/${id}`);
      return;
    }

    return navigate(`/notes/${id}`);
  };

  // default ver function
  const handleClickNoteDefault = () => {
    if (displayType === 'DETAIL') return;

    return navigate(`/notes/${id}`);
  };

  const navigateToProfile = (e: MouseEvent) => {
    e.stopPropagation();

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
        onClick={featureFlags?.friendList ? handleClickNote : handleClickNoteDefault}
        style={
          featureFlags?.friendList
            ? { overflow: displayType === 'DETAIL' ? 'visible' : undefined }
            : undefined
        }
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
            <Layout.FlexCol>
              <Layout.FlexRow onClick={navigateToProfile} gap={4} alignItems="center">
                <Typo type="title-medium" ellipsis={{ enabled: true, maxWidth: 140 }}>
                  {username}
                </Typo>
                {!current_user_read && !isMyPage && <UpdatedLabel />}
              </Layout.FlexRow>
              <Layout.FlexRow alignItems="center" gap={4}>
                <Typo type="label-medium" color="MEDIUM_GRAY">
                  {created_at && convertTimeDiffByString({ day: new Date(created_at) })}
                </Typo>
                {/* 공개범위 - 본인페이지에서만 표시 */}
                {isMyPage && (
                  <>
                    <Typo type="label-medium" color="BLACK">
                      •
                    </Typo>
                    <Typo type="label-medium" color="BLACK">
                      {visibility === 'close_friends' ? t('close_friend') : t('friend')}
                    </Typo>
                  </>
                )}
              </Layout.FlexRow>
            </Layout.FlexCol>
          </Layout.FlexRow>
          {/* 더보기 */}
          <Layout.FlexRow>
            <Icon name="dots_menu" size={24} onClick={handleClickMore} />
          </Layout.FlexRow>
        </Layout.FlexRow>
        <Layout.FlexCol>
          <ContentTranslation
            content={content}
            translateContent={!isMyPage && displayType === 'DETAIL'}
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
        {/* ver Q */}
        {featureFlags?.friendList ? (
          <PostFooter
            isMyPage={isMyPage}
            post={note}
            showComments={() => setBottomSheet(true)}
            setInputFocus={() => setInputFocus(true)}
            displayType={displayType}
            refresh={refresh}
          />
        ) : (
          // ver R
          <PostFooterDefault
            likedUserList={like_user_sample}
            isMyPage={isMyPage}
            post={note}
            showComments={() => setBottomSheet(true)}
            setInputFocus={() => setInputFocus(true)}
            displayType={displayType}
            refresh={refresh}
          />
        )}
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
            refresh?.();
          }}
        />
      )}
    </>
  );
}

export default NoteItem;

const PROFILE_IMAGE_SIZE = 44;
