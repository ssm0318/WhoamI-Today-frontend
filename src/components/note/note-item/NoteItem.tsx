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
import { Layout, SvgIcon, Typo } from '@design-system';
import { Note, POST_DP_TYPE } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { getMyProfile } from '@utils/apis/my';
import { pinPost, unpinPost } from '@utils/apis/pin';
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
    pinned,
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

  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));

  const { username, profile_image } = author_detail ?? {};
  const [t] = useTranslation('translation', { keyPrefix: 'notes' });
  const [tPin] = useTranslation('translation', { keyPrefix: 'post_more_modal' });
  const [tAccess] = useTranslation('translation', { keyPrefix: 'access_setting' });

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
      navigate(`/notes/${id}`);
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

  const handleClickPin = async (e: MouseEvent) => {
    e.stopPropagation();
    try {
      if (pinned) {
        // TODO: pin_id를 실제 값으로 가져와서 사용해야 함. 현재는 임시로 0을 사용
        await unpinPost(0);
        openToast({ message: tPin('unpin.success_title') });
      } else {
        await pinPost('Note', id);
        openToast({ message: tPin('pin.success_title') });
      }
      await getMyProfile();
      refresh?.();
    } catch (error) {
      openToast({
        message: pinned ? tPin('unpin.error_title') : tPin('pin.error_title'),
      });
    }
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
            {/* author, created_at information */}
            <Layout.FlexCol>
              <Layout.FlexRow onClick={navigateToProfile} gap={4} alignItems="center">
                <Typo type="title-medium" ellipsis={{ enabled: true, maxWidth: 140 }}>
                  {username}
                </Typo>
                {(author_detail as any)?.connection_status === 'close_friend' && (
                  <SvgIcon name="close_friend" size={16} />
                )}
                {!current_user_read && !isMyPage && <UpdatedLabel />}
              </Layout.FlexRow>
              <Layout.FlexRow alignItems="center" gap={4} style={{ flexWrap: 'wrap' }}>
                <Typo type="label-medium" color="MEDIUM_GRAY">
                  {created_at && convertTimeDiffByString({ day: new Date(created_at) })}
                </Typo>
                {!isMyPage &&
                  author_detail &&
                  ((author_detail.mutual_friend_count ?? 0) > 0 ||
                    (author_detail.mutual_interest_count ?? 0) > 0 ||
                    (author_detail.mutual_persona_count ?? 0) > 0) && (
                    <>
                      {(author_detail.mutual_friend_count ?? 0) > 0 && (
                        <>
                          <Typo type="label-medium" color="MEDIUM_GRAY">
                            ·
                          </Typo>
                          <Typo type="label-medium" color="DARK_GRAY">
                            {author_detail.mutual_friend_count} mutual{' '}
                            {author_detail.mutual_friend_count === 1 ? 'friend' : 'friends'}
                          </Typo>
                        </>
                      )}
                      {(author_detail.mutual_interest_count ?? 0) +
                        (author_detail.mutual_persona_count ?? 0) >
                        0 && (
                        <>
                          <Typo type="label-medium" color="MEDIUM_GRAY">
                            ·
                          </Typo>
                          <Typo type="label-medium" color="DARK_GRAY">
                            {(author_detail.mutual_interest_count ?? 0) +
                              (author_detail.mutual_persona_count ?? 0)}{' '}
                            shared{' '}
                            {(author_detail.mutual_interest_count ?? 0) +
                              (author_detail.mutual_persona_count ?? 0) ===
                            1
                              ? 'trait'
                              : 'traits'}
                          </Typo>
                        </>
                      )}
                    </>
                  )}
              </Layout.FlexRow>
              {/* Visibility scope - only shown on own page */}
              {isMyPage && visibility && (
                <Layout.FlexRow alignItems="center" gap={4} style={{ flexWrap: 'wrap' }}>
                  <SvgIcon name="eye" size={16} color="MEDIUM_GRAY" />
                  {Array.isArray(visibility) ? (
                    visibility.map((vis, index) => (
                      <Layout.FlexRow key={vis} alignItems="center" gap={4}>
                        <Typo type="label-medium" color="MEDIUM_GRAY" underline>
                          {tAccess(String(vis).toLowerCase())}
                        </Typo>
                        {index < visibility.length - 1 && (
                          <Typo type="label-medium" color="MEDIUM_GRAY">
                            ,
                          </Typo>
                        )}
                      </Layout.FlexRow>
                    ))
                  ) : (
                    <Typo type="label-medium" color="MEDIUM_GRAY" underline>
                      {tAccess(String(visibility).toLowerCase())}
                    </Typo>
                  )}
                </Layout.FlexRow>
              )}
            </Layout.FlexCol>
          </Layout.FlexRow>
          {/* Pin and More options */}
          <Layout.FlexRow alignItems="center" gap={8}>
            {(isMyPage || pinned) && (
              <SvgIcon
                name={pinned ? 'pin_filled' : 'pin_empty'}
                size={24}
                color={pinned ? 'BLACK' : 'MEDIUM_GRAY'}
                onClick={(e) => {
                  console.log('Pin icon clicked', {
                    isMyPage,
                    pinned,
                    onClickCondition: isMyPage || pinned,
                  });
                  if (isMyPage || pinned) {
                    handleClickPin(e);
                  }
                }}
              />
            )}
            <Icon name="dots_menu" size={24} onClick={handleClickMore} />
          </Layout.FlexRow>
        </Layout.FlexRow>
        <Layout.FlexCol>
          <ContentTranslation
            content={content}
            translateContent={!isMyPage && displayType === 'DETAIL'}
          />
          {/* Note image - only show 1 */}
          {images[0] && (
            <Layout.FlexRow w="100%" mv={10}>
              <NoteImage src={images[0]} />
            </Layout.FlexRow>
          )}
          {/* (Edited) */}
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
