import { MouseEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import PostFooter from '@components/_common/post-footer/PostFooter';
import PostMoreModal from '@components/_common/post-more-modal/PostMoreModal';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import CommentBottomSheet from '@components/comments/comment-bottom-sheet/CommentBottomSheet';
import UpdatedLabel from '@components/friends/updated-label/UpdatedLabel';
import { SCREEN_WIDTH } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import { POST_DP_TYPE, Response } from '@models/post';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import QuestionItem from '../question-item/QuestionItem';

interface ResponseItemProps {
  response: Response;
  isMyPage?: boolean;
  commentType?: POST_DP_TYPE;
  refresh?: () => void;
}

function ResponseItem({
  response,
  isMyPage = false,
  commentType = 'LIST',
  refresh,
}: ResponseItemProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'responses' });
  const {
    content,
    created_at,
    author_detail,
    question,
    like_reaction_user_sample,
    is_edited,
    current_user_read,
  } = response;
  const { username, profile_image } = author_detail ?? {};
  const [overflowSummary, setOverflowSummary] = useState<string>();
  const [bottomSheet, setBottomSheet] = useState<boolean>(false);
  const [inputFocus, setInputFocus] = useState(false);

  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

  const handleClickMore = (e: MouseEvent) => {
    e.stopPropagation();
    setShowMore(true);
  };

  const handleClickDetail = () => {
    if (commentType === 'DETAIL') return;

    if (!isMyPage) {
      navigate(`./responses/${response.id}`);
      return;
    }

    navigate(`/responses/${response.id}`);
  };

  const navigateToProfile = () => {
    navigate(`/users/${username}`);
  };

  useEffect(() => {
    if (commentType !== 'LIST') return;
    if (content.length > MAX_RESPONSE_CONTENT_LENGTH)
      setOverflowSummary(content.slice(0, MAX_RESPONSE_CONTENT_LENGTH));

    const contentArrWithNewLine = content.split('\n');
    if (contentArrWithNewLine.length > MAX_RESPONSE_NEW_LINE)
      setOverflowSummary(contentArrWithNewLine.slice(0, MAX_RESPONSE_NEW_LINE).join('\n'));
  }, [content, commentType]);

  return (
    <>
      <Layout.FlexRow
        p={WRAPPER_PADDING}
        rounded={12}
        outline="LIGHT"
        w={commentType === 'LIST' ? RESPONSE_WIDTH : '100%'}
        onClick={handleClickDetail}
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
              {/* author, created_at 정보 */}
              <Layout.FlexRow alignItems="center" gap={8}>
                <Layout.FlexRow onClick={navigateToProfile}>
                  <Typo type="title-medium">{username}</Typo>
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
          <Layout.FlexCol w="100%" mb={8}>
            <Typo type="body-large" color="BLACK" pre>
              {overflowSummary ? (
                <>
                  {`${overflowSummary}...`}
                  <Typo type="body-medium" color="BLACK" italic underline ml={3}>
                    {t('more').toLowerCase()}
                  </Typo>
                </>
              ) : (
                content
              )}
            </Typo>
            {/* (수정됨) */}
            {is_edited && (
              <Typo type="label-medium" color="MEDIUM_GRAY">
                {`(${t('edited')})`}
              </Typo>
            )}
            <Layout.FlexRow w="100%" justifyContent="flex-end" />
          </Layout.FlexCol>
          <QuestionItem question={question} />
          <PostFooter
            reactionSampleUserList={like_reaction_user_sample}
            isMyPage={isMyPage}
            post={response}
            showComments={() => setBottomSheet(true)}
            setInputFocus={() => setInputFocus(true)}
            commentType={commentType}
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
