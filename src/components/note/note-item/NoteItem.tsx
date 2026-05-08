import { MouseEvent, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ContentTranslation from '@components/_common/content-translation/ContentTranslation';
import Icon from '@components/_common/icon/Icon';
import LinkifiedText from '@components/_common/linkified-text/LinkifiedText';
import MutualMetaText from '@components/_common/mutual-meta-text/MutualMetaText';
import PostFooter from '@components/_common/post-footer/PostFooter';
import PostFooterDefault from '@components/_common/post-footer/PostFooterDefault';
import PostFooterLikeOnly from '@components/_common/post-footer/PostFooterLikeOnly';
import PostMoreModal from '@components/_common/post-more-modal/PostMoreModal';
import PostTypeTag from '@components/_common/post-type-tag/PostTypeTag';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import PromptSummaryCard from '@components/_common/prompt-summary-card/PromptSummaryCard';
import CommentBottomSheet from '@components/comments/comment-bottom-sheet/CommentBottomSheet';
import { Layout, SvgIcon, Typo } from '@design-system';
import { Note, POST_DP_TYPE, ShareType } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { isPostsVerQClient } from '@utils/apis/userApiPrefix';
import { classifyPathnameAsSource } from '@utils/navSource';
import { applyLikeUserSampleOptimistic } from '@utils/optimisticLikeUserSample';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import { NoteImage } from '../note-image/NoteImage.styled';

interface NoteItemProps {
  note: Note;
  isMyPage: boolean;
  displayType?: POST_DP_TYPE;
  refresh?: () => void;
  profileImageSize?: number;
  previewMode?: boolean;
  hideMissionPrompt?: boolean;
  isCarouselItem?: boolean;
  hideTimestamp?: boolean;
  showMutualCounts?: boolean;
  showMissionMeta?: boolean;
}

function NoteItem({
  note,
  isMyPage,
  displayType = 'LIST',
  refresh,
  profileImageSize = PROFILE_IMAGE_SIZE,
  previewMode = false,
  hideMissionPrompt = false,
  isCarouselItem = false,
  hideTimestamp = false,
  showMutualCounts = false,
  showMissionMeta = false,
}: NoteItemProps) {
  const {
    content,
    created_at,
    id,
    author_detail,
    images,
    is_edited,
    visibility,
    share_type,
    mission_prompt,
  } = note;
  const isMissionPost = share_type === ShareType.MISSION;
  const navigate = useNavigate();
  const location = useLocation();
  const { featureFlags, myProfile } = useBoundStore(UserSelector);
  const postsVerQUi = isPostsVerQClient(featureFlags?.postsVerQ, myProfile?.current_ver);

  const [bottomSheet, setBottomSheet] = useState<boolean>(false);
  const [overflowSummary, setOverflowSummary] = useState<string>();
  const [showMore, setShowMore] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [likePatch, setLikePatch] = useState<Partial<Note> | null>(null);
  const [showImagePopup, setShowImagePopup] = useState(false);

  useEffect(() => {
    if (displayType !== 'LIST') {
      setOverflowSummary(undefined);
      return;
    }
    if (content.length > MAX_NOTE_CONTENT_LENGTH)
      setOverflowSummary(content.slice(0, MAX_NOTE_CONTENT_LENGTH));

    const contentArrWithNewLine = content.split('\n');
    if (contentArrWithNewLine.length > MAX_NOTE_NEW_LINE)
      setOverflowSummary(contentArrWithNewLine.slice(0, MAX_NOTE_NEW_LINE).join('\n'));
  }, [content, displayType]);

  const footerPost = useMemo(
    () => (likePatch ? { ...note, ...likePatch } : note),
    [note, likePatch],
  );

  useEffect(() => {
    setLikePatch(null);
  }, [note.id, note.like_count, note.current_user_like_id]);

  const handleLikeUpdated = (liked: boolean, likeId: number | null) => {
    setLikePatch((prev) => {
      const base = { ...note, ...prev };
      const c = base.like_count ?? 0;
      return {
        current_user_like_id: likeId,
        like_count: liked ? c + 1 : Math.max(0, c - 1),
        like_user_sample: applyLikeUserSampleOptimistic(base.like_user_sample, liked, myProfile),
      };
    });
  };

  const { emojiPickerTarget, setEmojiPickerTarget } = useBoundStore((state) => ({
    emojiPickerTarget: state.emojiPickerTarget,
    setEmojiPickerTarget: state.setEmojiPickerTarget,
  }));

  const { username, profile_image } = author_detail ?? {};
  const [t] = useTranslation('translation', { keyPrefix: 'notes' });
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
    // Derive a source label from the current pathname so the destination
    // UserPage knows the entry surface. NoteItem is reused across many
    // routes; rather than thread a `source` prop through every parent,
    // we infer from where the click happened.
    navigate(`/users/${username}`, {
      state: { source: classifyPathnameAsSource(location.pathname) },
    });
  };

  const openImagePopup = (e: MouseEvent) => {
    e.stopPropagation();
    setShowImagePopup(true);
  };

  if (isHidden) return null;

  const headerJsx = (
    <Layout.FlexRow
      w="100%"
      alignItems="center"
      justifyContent="space-between"
      h={profileImageSize}
    >
      <Layout.FlexRow w="100%" alignItems="center" gap={8}>
        <ProfileImage
          imageUrl={profile_image}
          username={username}
          size={profileImageSize}
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
          </Layout.FlexRow>
          <Layout.FlexRow alignItems="center" gap={4} style={{ flexWrap: 'wrap' }}>
            {!hideTimestamp && (
              <Typo type="label-medium" color="MEDIUM_GRAY">
                {created_at && convertTimeDiffByString({ day: new Date(created_at) })}
              </Typo>
            )}
            {!isMyPage && author_detail && username && (
              <MutualMetaText
                username={username}
                mutualFriendCount={
                  showMutualCounts
                    ? (note as any).mutual_friends_count ?? author_detail.mutual_friend_count ?? 0
                    : author_detail.mutual_friend_count ?? 0
                }
                mutualInterestCount={
                  showMutualCounts
                    ? (note as any).mutual_traits_count ?? author_detail.mutual_interest_count ?? 0
                    : author_detail.mutual_interest_count ?? 0
                }
                mutualPersonaCount={showMutualCounts ? 0 : author_detail.mutual_persona_count ?? 0}
                hideTraits={postsVerQUi && !showMutualCounts}
                hideLeadingSeparator={hideTimestamp}
              />
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
      {/* More options */}
      <Layout.FlexRow alignItems="center" gap={8}>
        <Icon name="dots_menu" size={24} onClick={handleClickMore} />
      </Layout.FlexRow>
    </Layout.FlexRow>
  );

  const missionPromptJsx =
    isMissionPost && mission_prompt && !hideMissionPrompt ? (
      showMissionMeta ? (
        <PromptSummaryCard
          content={mission_prompt}
          date={created_at}
          trailing={
            <>
              <Typo type="label-medium" color="MEDIUM_GRAY">
                ·
              </Typo>
              <PostTypeTag variant="mission" />
            </>
          }
          onClick={() => {
            if (note.mission_id) navigate(`/missions/${note.mission_id}`);
          }}
        />
      ) : (
        <Typo type="label-medium" color="MEDIUM_GRAY" italic>
          ↳ {`"${mission_prompt}"`}
        </Typo>
      )
    ) : null;

  const missionAttemptLabelJsx =
    isMissionPost && showMissionMeta && note.mission_attempt_number ? (
      <Typo type="label-medium" color="PRIMARY" bold>
        ATTEMPT {note.mission_attempt_number} / 3
      </Typo>
    ) : null;

  const contentJsx = (
    <Layout.FlexCol gap={4}>
      {previewMode ? (
        <>
          {images[0] && (
            <PostImageButton type="button" aria-label="Open image preview" onClick={openImagePopup}>
              <PreviewImage src={images[0]} alt="note" />
            </PostImageButton>
          )}
          {content && (
            <Typo type="body-medium" color="BLACK" pre>
              <LinkifiedText>{content}</LinkifiedText>
            </Typo>
          )}
          {missionPromptJsx}
        </>
      ) : (
        <>
          {missionAttemptLabelJsx}
          {displayType === 'DETAIL' ? (
            <ContentTranslation content={content} translateContent={!isMyPage} />
          ) : (
            <Typo type="body-large" color="BLACK" pre>
              {overflowSummary ? (
                <>
                  <LinkifiedText>{`${overflowSummary}...`}</LinkifiedText>
                  <Typo type="body-medium" color="BLACK" italic underline ml={3}>
                    {t('more').toLowerCase()}
                  </Typo>
                </>
              ) : (
                <LinkifiedText>{content || ''}</LinkifiedText>
              )}
            </Typo>
          )}
          {/* Note image - only show 1 */}
          {images[0] && (
            <Layout.FlexRow w="100%" mv={10}>
              <PostImageButton
                type="button"
                aria-label="Open image preview"
                onClick={openImagePopup}
              >
                <NoteImage src={images[0]} alt="note" />
              </PostImageButton>
            </Layout.FlexRow>
          )}
          {missionPromptJsx}
          {/* (Edited) */}
          {is_edited && (
            <Typo type="label-medium" color="MEDIUM_GRAY">
              {`(${t('edited')})`}
            </Typo>
          )}
        </>
      )}
    </Layout.FlexCol>
  );

  const footerJsx = postsVerQUi ? (
    <PostFooterLikeOnly
      post={footerPost}
      showComments={() => setBottomSheet(true)}
      setInputFocus={() => setInputFocus(true)}
      displayType={displayType}
      refresh={refresh}
      onLikeUpdated={handleLikeUpdated}
    />
  ) : featureFlags?.friendList ? (
    <PostFooter
      post={note}
      showComments={() => setBottomSheet(true)}
      setInputFocus={() => setInputFocus(true)}
      displayType={displayType}
    />
  ) : (
    // ver R
    <PostFooterDefault
      post={note}
      showComments={() => setBottomSheet(true)}
      setInputFocus={() => setInputFocus(true)}
      displayType={displayType}
    />
  );

  return (
    <>
      <Layout.FlexCol
        w="100%"
        p={12}
        gap={8}
        bgColor="WHITE"
        outline={isCarouselItem && isMyPage ? undefined : 'LIGHT'}
        rounded={12}
        onClick={featureFlags?.friendList ? handleClickNote : handleClickNoteDefault}
        style={
          previewMode
            ? { height: '100%', minHeight: 0, overflow: 'hidden', position: 'relative' }
            : featureFlags?.friendList
            ? { overflow: displayType === 'DETAIL' ? 'visible' : undefined }
            : undefined
        }
      >
        <PostMoreModal
          isVisible={showMore}
          setIsVisible={setShowMore}
          post={note}
          isMyPage={isMyPage}
          onConfirmReport={() => {
            setIsHidden(true);
            refresh?.();
          }}
        />
        {previewMode ? (
          <>
            <PreviewBody>
              {headerJsx}
              {contentJsx}
            </PreviewBody>
            <PreviewFooterWrap>
              <PreviewFade />
              {footerJsx}
            </PreviewFooterWrap>
          </>
        ) : (
          <>
            {headerJsx}
            {contentJsx}
            {footerJsx}
          </>
        )}
      </Layout.FlexCol>
      {images[0] &&
        showImagePopup &&
        createPortal(
          <ImagePreviewBackdrop type="button" onClick={() => setShowImagePopup(false)}>
            <ImagePreview src={images[0]} alt="Full size note" />
          </ImagePreviewBackdrop>,
          document.body,
        )}
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
const MAX_NOTE_CONTENT_LENGTH = 450;
const MAX_NOTE_NEW_LINE = 14;

const PreviewImage = styled.img`
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
`;

const PostImageButton = styled.button`
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: zoom-in;
`;

const ImagePreviewBackdrop = styled.button`
  position: fixed;
  top: 0;
  left: 50%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 500px;
  height: 100vh;
  padding: 0;
  border: none;
  background: rgba(0, 0, 0, 0.85);
  cursor: pointer;
  transform: translateX(-50%);
`;

const ImagePreview = styled.img`
  max-width: 90%;
  max-height: 80vh;
  object-fit: contain;
`;

const PreviewBody = styled.div`
  flex: 1;
  width: 100%;
  min-height: 0;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PreviewFooterWrap = styled.div`
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 12px;
  background-color: white;
  z-index: 2;
`;

const PreviewFade = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 100%;
  height: 32px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #ffffff 100%);
  pointer-events: none;
`;
