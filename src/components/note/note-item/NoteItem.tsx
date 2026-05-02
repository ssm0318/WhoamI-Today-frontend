import { MouseEvent, useState } from 'react';
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
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import CommentBottomSheet from '@components/comments/comment-bottom-sheet/CommentBottomSheet';
import { Layout, SvgIcon, Typo } from '@design-system';
import { Note, POST_DP_TYPE, ShareType } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { classifyPathnameAsSource } from '@utils/navSource';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import { NoteImage } from '../note-image/NoteImage.styled';

interface NoteItemProps {
  note: Note;
  isMyPage: boolean;
  displayType?: POST_DP_TYPE;
  refresh?: () => void;
  profileImageSize?: number;
  previewMode?: boolean;
}

function NoteItem({
  note,
  isMyPage,
  displayType = 'LIST',
  refresh,
  profileImageSize = PROFILE_IMAGE_SIZE,
  previewMode = false,
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
  const { featureFlags } = useBoundStore(UserSelector);

  const [bottomSheet, setBottomSheet] = useState<boolean>(false);
  const [showMore, setShowMore] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

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
            <Typo type="label-medium" color="MEDIUM_GRAY">
              {created_at && convertTimeDiffByString({ day: new Date(created_at) })}
            </Typo>
            {isMissionPost && (
              <>
                <Typo type="label-medium" color="MEDIUM_GRAY">
                  ·
                </Typo>
                <Typo type="label-medium" color="PRIMARY">
                  ✦ {t('mission_label')}
                </Typo>
              </>
            )}
            {!isMyPage && author_detail && username && (
              <MutualMetaText
                username={username}
                mutualFriendCount={author_detail.mutual_friend_count ?? 0}
                mutualInterestCount={author_detail.mutual_interest_count ?? 0}
                mutualPersonaCount={author_detail.mutual_persona_count ?? 0}
                hideTraits={featureFlags?.postsVerQ}
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
    isMissionPost && mission_prompt ? (
      <Typo type="label-medium" color="MEDIUM_GRAY" italic>
        ↳ {`"${mission_prompt}"`}
      </Typo>
    ) : null;

  const contentJsx = (
    <Layout.FlexCol gap={4}>
      {previewMode ? (
        <>
          {images[0] && <PreviewImage src={images[0]} />}
          {content && (
            <Typo type="body-medium" color="BLACK" pre>
              <LinkifiedText>{content}</LinkifiedText>
            </Typo>
          )}
          {missionPromptJsx}
        </>
      ) : (
        <>
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

  const footerJsx = featureFlags?.postsVerQ ? (
    <PostFooterLikeOnly
      post={note}
      showComments={() => setBottomSheet(true)}
      setInputFocus={() => setInputFocus(true)}
      displayType={displayType}
      refresh={refresh}
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
        outline="LIGHT"
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

const PreviewImage = styled.img`
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
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
