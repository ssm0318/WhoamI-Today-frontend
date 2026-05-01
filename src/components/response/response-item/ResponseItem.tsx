import { MouseEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ContentTranslation from '@components/_common/content-translation/ContentTranslation';
import Icon from '@components/_common/icon/Icon';
import LinkifiedText from '@components/_common/linkified-text/LinkifiedText';
import MutualMetaText from '@components/_common/mutual-meta-text/MutualMetaText';
import PostFooter from '@components/_common/post-footer/PostFooter';
import PostFooterLikeOnly from '@components/_common/post-footer/PostFooterLikeOnly';
import PostMoreModal from '@components/_common/post-more-modal/PostMoreModal';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import CommentBottomSheet from '@components/comments/comment-bottom-sheet/CommentBottomSheet';
import { SCREEN_WIDTH } from '@constants/layout';
import { Layout, SvgIcon, Typo } from '@design-system';
import { POST_DP_TYPE, Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import QuestionItem from '../question-item/QuestionItem';

interface ResponseItemProps {
  response: Response;
  isMyPage?: boolean;
  displayType?: POST_DP_TYPE;
  refresh?: () => void;
  emojiPickerPortalId?: string;
  profileImageSize?: number;
  previewMode?: boolean;
  disableQuestionNavigation?: boolean;
}

function ResponseItem({
  response,
  isMyPage = false,
  displayType = 'LIST',
  refresh,
  emojiPickerPortalId,
  profileImageSize = PROFILE_IMAGE_SIZE,
  previewMode = false,
  disableQuestionNavigation = false,
}: ResponseItemProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'responses' });
  const [tAccess] = useTranslation('translation', { keyPrefix: 'access_setting' });

  const [overflowSummary, setOverflowSummary] = useState<string>();
  const [bottomSheet, setBottomSheet] = useState<boolean>(false);
  const [inputFocus, setInputFocus] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const { emojiPickerTarget, setEmojiPickerTarget } = useBoundStore((state) => ({
    emojiPickerTarget: state.emojiPickerTarget,
    setEmojiPickerTarget: state.setEmojiPickerTarget,
  }));
  const { featureFlags } = useBoundStore(UserSelector);

  const navigate = useNavigate();

  useEffect(() => {
    if (displayType !== 'LIST') {
      setOverflowSummary(undefined);
      return;
    }
    if (response.content.length > MAX_RESPONSE_CONTENT_LENGTH)
      setOverflowSummary(response.content.slice(0, MAX_RESPONSE_CONTENT_LENGTH));

    const contentArrWithNewLine = response.content.split('\n');
    if (contentArrWithNewLine.length > MAX_RESPONSE_NEW_LINE)
      setOverflowSummary(contentArrWithNewLine.slice(0, MAX_RESPONSE_NEW_LINE).join('\n'));
  }, [response.content, displayType]);

  const { content, created_at, author_detail, question, image, is_edited, visibility } = response;

  const { username, profile_image } = author_detail ?? {};

  const handleClickMore = (e: MouseEvent) => {
    e.stopPropagation();
    setShowMore(true);
  };

  const handleClickDetail = (e: MouseEvent) => {
    if (emojiPickerTarget) {
      return setEmojiPickerTarget(null);
    }

    e.stopPropagation();
    if (displayType === 'DETAIL') return;

    if (!isMyPage) {
      navigate(`/responses/${response.id}`);
      return;
    }

    navigate(`/responses/${response.id}`);
  };

  const navigateToProfile = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`/users/${username}`);
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
            <Typo type="title-medium" ellipsis={{ enabled: true, maxWidth: 90 }}>
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
          {isMyPage && visibility && visibility.length > 0 && (
            <Layout.FlexRow alignItems="center" gap={4} style={{ flexWrap: 'wrap' }}>
              <SvgIcon name="eye" size={16} color="MEDIUM_GRAY" />
              {visibility.map((vis, index) => (
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
              ))}
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

  const contentJsx = (
    <Layout.FlexCol
      w="100%"
      mb={8}
      style={{
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
      }}
    >
      {previewMode ? (
        <Typo type="body-medium" color="BLACK" pre>
          <LinkifiedText>{content || ''}</LinkifiedText>
        </Typo>
      ) : displayType === 'DETAIL' ? (
        <ContentTranslation content={content || ''} translateContent={!isMyPage} />
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
      {/* Response image */}
      {image && (
        <RespImageWrapper>
          <img src={image} alt="response" style={{ width: '100%', borderRadius: 8 }} />
        </RespImageWrapper>
      )}
      {/* (Edited) */}
      {!previewMode && is_edited && (
        <Typo type="label-medium" color="MEDIUM_GRAY">
          {`(${t('edited')})`}
        </Typo>
      )}
      <Layout.FlexRow w="100%" justifyContent="flex-end" />
    </Layout.FlexCol>
  );

  const questionJsx = question ? (
    <QuestionItem question={question} disableNavigation={disableQuestionNavigation} />
  ) : null;

  const footerJsx = featureFlags?.postsVerQ ? (
    <PostFooterLikeOnly
      post={response}
      showComments={() => setBottomSheet(true)}
      setInputFocus={() => setInputFocus(true)}
      displayType={displayType}
      refresh={refresh}
    />
  ) : (
    <PostFooter
      post={response}
      showComments={() => setBottomSheet(true)}
      setInputFocus={() => setInputFocus(true)}
      displayType={displayType}
      emojiPickerPortalId={emojiPickerPortalId}
    />
  );

  return (
    <>
      <Layout.FlexRow
        p={WRAPPER_PADDING}
        rounded={12}
        outline="LIGHT"
        w="100%"
        onClick={handleClickDetail}
        style={
          previewMode
            ? { height: '100%', minHeight: 0, overflow: 'hidden', position: 'relative' }
            : { overflow: displayType === 'DETAIL' ? 'visible' : undefined }
        }
      >
        <PostMoreModal
          isVisible={showMore}
          setIsVisible={setShowMore}
          post={response}
          isMyPage={isMyPage}
          onConfirmReport={() => {
            setIsHidden(true);
            refresh?.();
          }}
        />
        <Layout.FlexCol
          gap={8}
          w="100%"
          style={
            previewMode
              ? { height: '100%', minHeight: 0, overflow: 'hidden', position: 'relative' }
              : undefined
          }
        >
          {previewMode ? (
            <>
              <PreviewBody>
                {headerJsx}
                {contentJsx}
                {questionJsx}
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
              {questionJsx}
              {footerJsx}
            </>
          )}
        </Layout.FlexCol>
      </Layout.FlexRow>
      {bottomSheet && (
        <CommentBottomSheet
          postType="Response"
          post={response}
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

export default ResponseItem;

const PROFILE_IMAGE_SIZE = 44;
export const WRAPPER_PADDING = 12;

const PreviewBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PreviewFooterWrap = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
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

const RESPONSE_GAP = 16;
const RESPONSE_MARGIN = 12;
export const RESPONSE_WIDTH = SCREEN_WIDTH - 4 * RESPONSE_MARGIN - RESPONSE_GAP * 2;
export const RESPONSE_HEIGHT = 368;

const MAX_RESPONSE_CONTENT_LENGTH = 140;
const MAX_RESPONSE_NEW_LINE = 5;

const RespImageWrapper = styled.div`
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px;
`;
