import { useEffect, useState } from 'react';
import { getAuthorProfileInfo } from '@components/_common/author-profile/AuthorProfile.helper';
import Icon from '@components/_common/icon/Icon';
import PostFooter from '@components/_common/post-footer/PostFooter';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { SCREEN_WIDTH } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import { friendList } from '@mock/friends';
import { Response } from '@models/post';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import QuestionItem from '../question-item/QuestionItem';

interface ResponseItemProps {
  response: Response;
  isMyPage?: boolean;
}

function ResponseItem({ response, isMyPage = false }: ResponseItemProps) {
  const { content, created_at, author_detail, question } = response;
  const { username, imageUrl } = getAuthorProfileInfo(author_detail);
  const [overflowActive, setOverflowActive] = useState<boolean>(false);

  const likedUserList = friendList;

  const handleClickMore = () => {
    // TODO
    console.log('more');
  };

  useEffect(() => {
    if (content.length > MAX_RESPONSE_CONTENT_LENGTH) {
      setOverflowActive(true);
    }
  }, [content]);

  return (
    <Layout.FlexRow p={WRAPPER_PADDING} rounded={12} outline="LIGHT" h="100%" w={RESPONSE_WIDTH}>
      <Layout.FlexCol gap={8} w="100%">
        <Layout.FlexRow
          w="100%"
          alignItems="center"
          justifyContent="space-between"
          h={PROFILE_IMAGE_SIZE}
        >
          <Layout.FlexRow w="100%" alignItems="center" gap={8}>
            <ProfileImage imageUrl={imageUrl} username={username} size={PROFILE_IMAGE_SIZE} />
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
        <PostFooter likedUserList={likedUserList} isMyPage={isMyPage} post={response} />
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
