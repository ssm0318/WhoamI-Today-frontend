import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@components/_common/icon/Icon';
import LikeButton from '@components/_common/like-button/LikeButton';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { SCREEN_WIDTH } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import { Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import QuestionItem from '../question-item/QuestionItem';

interface ResponseItemProps {
  response: Response;
  isMyPage?: boolean;
}

function ResponseItem({ response, isMyPage = false }: ResponseItemProps) {
  // TODO Gina BE main 브랜치 merge 후 수정 필요 (author_detail)
  // const { content, created_at, author_detail, question, like_count, comment_count } = response;
  const { content, created_at, question, comment_count } = response;
  // const { username } = getAuthorProfileInfo(author_detail);
  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));
  const [t] = useTranslation('translation', { keyPrefix: 'responses' });
  const [overflowActive, setOverflowActive] = useState<boolean>(false);

  const handleClickMore = () => {
    // TODO
    console.log('more');
  };

  const handleClickComment = () => {
    // TODO
    console.log('comment');
  };

  useEffect(() => {
    if (content.length > MAX_RESPONSE_CONTENT_LENGTH) {
      setOverflowActive(true);
    }
  }, [content]);

  return (
    <Layout.FlexRow p={WRAPPER_PADDING} rounded={12} outline="LIGHT" h="100%" w={NOTE_WIDTH}>
      <Layout.FlexCol gap={8} w="100%">
        <Layout.FlexRow
          w="100%"
          alignItems="center"
          justifyContent="space-between"
          h={PROFILE_IMAGE_SIZE}
        >
          <Layout.FlexRow w="100%" alignItems="center" gap={8}>
            <ProfileImage
              imageUrl={myProfile?.profile_image}
              username={myProfile?.username}
              size={PROFILE_IMAGE_SIZE}
            />
            {/* author, created_at 정보 */}
            <Layout.FlexRow alignItems="center" gap={8}>
              <Typo type="title-medium">USERNAME</Typo>
              <Typo type="label-medium" color="MEDIUM_GRAY">
                {convertTimeDiffByString(new Date(), new Date(created_at))}
              </Typo>
            </Layout.FlexRow>
          </Layout.FlexRow>
          {/* 더보기 */}
          <Layout.FlexRow>
            <Icon name="dots_menu" size={24} onClick={handleClickMore} />
          </Layout.FlexRow>
        </Layout.FlexRow>
        <Layout.FlexCol w="100%" mb={8}>
          <Typo type="body-large" color="BLACK">
            {overflowActive ? (
              <>
                {`${content.slice(0, MAX_RESPONSE_CONTENT_LENGTH)}...`}
                <Typo type="body-medium" color="BLACK" italic underline ml={3}>
                  more
                </Typo>
              </>
            ) : (
              content
            )}
          </Typo>
          <Layout.FlexRow w="100%" justifyContent="flex-end" />
        </Layout.FlexCol>
        <QuestionItem question={question} />
        <Layout.FlexRow gap={16} alignItems="center">
          {isMyPage ? (
            <Layout.FlexRow>{/* TODO 좋아요 누른 사람들 profile */}</Layout.FlexRow>
          ) : (
            <LikeButton
              postType="Response"
              post={response}
              iconSize={BOTTOM_ICON_SECTION_HEIGHT}
              m={0}
            />
          )}
          <Icon name="add_comment" size={BOTTOM_ICON_SECTION_HEIGHT} onClick={handleClickComment} />
        </Layout.FlexRow>
        <Layout.FlexRow>
          <Typo type="label-large" color="BLACK" underline>
            {comment_count || 0} {t('comments')}
          </Typo>
        </Layout.FlexRow>
      </Layout.FlexCol>
    </Layout.FlexRow>
  );
}

export default ResponseItem;

const PROFILE_IMAGE_SIZE = 44;
const WRAPPER_PADDING = 12;
const BOTTOM_ICON_SECTION_HEIGHT = 24;

const NOTE_GAP = 16;
const NOTE_MARGIN = 12;
export const NOTE_WIDTH = SCREEN_WIDTH - 4 * NOTE_MARGIN - NOTE_GAP * 2;
export const NOTE_HEIGHT = 368;

const MAX_RESPONSE_CONTENT_LENGTH = 140;
