import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import PostFooter from '@components/_common/post-footer/PostFooter';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { SCREEN_WIDTH } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import { Response } from '@models/post';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import QuestionItem from '../question-item/QuestionItem';

interface ResponseItemProps {
  response: Response;
  isMyPage?: boolean;
  type?: 'LIST' | 'DETAIL';
}

function ResponseItem({ response, isMyPage = false, type = 'LIST' }: ResponseItemProps) {
  const { content, created_at, author_detail, question, like_user_sample } = response;
  const { username, profile_image } = author_detail;
  const [overflowActive, setOverflowActive] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleClickMore = () => {
    // TODO
    console.log('more');
  };

  const handleClickDetail = () => {
    if (type === 'DETAIL') return;
    navigate(`/responses/${response.id}`);
  };

  useEffect(() => {
    if (content.length > MAX_RESPONSE_CONTENT_LENGTH) {
      setOverflowActive(true);
    }
  }, [content]);

  return (
    <Layout.FlexRow
      p={WRAPPER_PADDING}
      rounded={12}
      outline="LIGHT"
      w={type === 'LIST' ? RESPONSE_WIDTH : '100%'}
      onClick={handleClickDetail}
    >
      <Layout.FlexCol gap={8} w="100%">
        <Layout.FlexRow
          w="100%"
          alignItems="center"
          justifyContent="space-between"
          h={PROFILE_IMAGE_SIZE}
        >
          <Layout.FlexRow w="100%" alignItems="center" gap={8}>
            <ProfileImage imageUrl={profile_image} username={username} size={PROFILE_IMAGE_SIZE} />
            {/* author, created_at 정보 */}
            <Layout.FlexRow alignItems="center" gap={8}>
              <Typo type="title-medium">{username}</Typo>
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
        <PostFooter likedUserList={like_user_sample} isMyPage={isMyPage} post={response} />
      </Layout.FlexCol>
    </Layout.FlexRow>
  );
}

export default ResponseItem;

const PROFILE_IMAGE_SIZE = 44;
const WRAPPER_PADDING = 12;

const RESPONSE_GAP = 16;
const RESPONSE_MARGIN = 12;
export const RESPONSE_WIDTH = SCREEN_WIDTH - 4 * RESPONSE_MARGIN - RESPONSE_GAP * 2;
export const RESPONSE_HEIGHT = 368;

const MAX_RESPONSE_CONTENT_LENGTH = 140;
