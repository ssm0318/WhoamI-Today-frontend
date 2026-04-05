import { MouseEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ContentTranslation from '@components/_common/content-translation/ContentTranslation';
import Icon from '@components/_common/icon/Icon';
import PostFooter from '@components/_common/post-footer/PostFooter';
import PostMoreModal from '@components/_common/post-more-modal/PostMoreModal';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import CommentBottomSheet from '@components/comments/comment-bottom-sheet/CommentBottomSheet';
import UpdatedLabel from '@components/friends/updated-label/UpdatedLabel';
import { SCREEN_WIDTH } from '@constants/layout';
import { Layout, SvgIcon, Typo } from '@design-system';
import { POST_DP_TYPE, Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { getMyProfile } from '@utils/apis/my';
import { pinPost, unpinPost } from '@utils/apis/pin';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import QuestionItem from '../question-item/QuestionItem';

interface ResponseItemProps {
  response: Response;
  isMyPage?: boolean;
  displayType?: POST_DP_TYPE;
  refresh?: () => void;
}

function ResponseItem({
  response,
  isMyPage = false,
  displayType = 'LIST',
  refresh,
}: ResponseItemProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'responses' });
  const [tPin] = useTranslation('translation', { keyPrefix: 'post_more_modal' });
  const [tAccess] = useTranslation('translation', { keyPrefix: 'access_setting' });

  const [overflowSummary, setOverflowSummary] = useState<string>();
  const [bottomSheet, setBottomSheet] = useState<boolean>(false);
  const [inputFocus, setInputFocus] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const { emojiPickerTarget, setEmojiPickerTarget } = useBoundStore((state) => ({
    emojiPickerTarget: state.emojiPickerTarget,
    setEmojiPickerTarget: state.setEmojiPickerTarget,
  }));

  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));

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

  const {
    content,
    created_at,
    author_detail,
    question,
    is_edited,
    current_user_read,
    visibility,
    pinned,
    id,
  } = response;

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

  const handleClickPin = async (e: MouseEvent) => {
    e.stopPropagation();
    try {
      if (pinned) {
        // TODO: pin_id를 실제 값으로 가져와서 사용해야 함. 현재는 임시로 0을 사용
        await unpinPost(0);
        openToast({ message: tPin('unpin.success_title') });
      } else {
        await pinPost('Response', id);
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
      <Layout.FlexRow
        p={WRAPPER_PADDING}
        rounded={12}
        outline="LIGHT"
        w={displayType === 'DETAIL' || displayType === 'FEED' ? '100%' : RESPONSE_WIDTH}
        onClick={handleClickDetail}
        style={{
          overflow: displayType === 'DETAIL' ? 'visible' : undefined,
        }}
      >
        <PostMoreModal
          isVisible={showMore}
          setIsVisible={setShowMore}
          post={response}
          isMyPage={isMyPage}
          onConfirmReport={refresh}
        />
        <Layout.FlexCol gap={8} w="100%">
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
                  <Typo type="title-medium" ellipsis={{ enabled: true, maxWidth: 90 }}>
                    {username}
                  </Typo>
                  {(author_detail as any)?.connection_status === 'close_friend' && (
                    <SvgIcon name="close_friend" size={16} />
                  )}
                </Layout.FlexRow>
                {!current_user_read && !isMyPage && <UpdatedLabel />}
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
          <Layout.FlexCol
            w="100%"
            mb={8}
            style={{
              whiteSpace: 'pre-wrap',
              overflowWrap: 'break-word', // Line break by whitespace units
              wordBreak: 'break-word', // Allow line break even when there's no whitespace
            }}
          >
            {displayType === 'DETAIL' ? (
              <ContentTranslation content={content || ''} translateContent={!isMyPage} />
            ) : (
              <Typo type="body-large" color="BLACK" pre>
                {overflowSummary ? (
                  <>
                    {`${overflowSummary}...`}
                    <Typo type="body-medium" color="BLACK" italic underline ml={3}>
                      {t('more').toLowerCase()}
                    </Typo>
                  </>
                ) : (
                  content || ''
                )}
              </Typo>
            )}
            {/* (Edited) */}
            {is_edited && (
              <Typo type="label-medium" color="MEDIUM_GRAY">
                {`(${t('edited')})`}
              </Typo>
            )}
            <Layout.FlexRow w="100%" justifyContent="flex-end" />
          </Layout.FlexCol>
          {question && <QuestionItem question={question} />}
          <PostFooter
            isMyPage={isMyPage}
            post={response}
            showComments={() => setBottomSheet(true)}
            setInputFocus={() => setInputFocus(true)}
            displayType={displayType}
            refresh={refresh}
          />
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

const RESPONSE_GAP = 16;
const RESPONSE_MARGIN = 12;
export const RESPONSE_WIDTH = SCREEN_WIDTH - 4 * RESPONSE_MARGIN - RESPONSE_GAP * 2;
export const RESPONSE_HEIGHT = 368;

const MAX_RESPONSE_CONTENT_LENGTH = 140;
const MAX_RESPONSE_NEW_LINE = 5;
