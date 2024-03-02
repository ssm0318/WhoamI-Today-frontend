import { getAuthorProfileInfo } from '@components/_common/author-profile/AuthorProfile.helper';
import Icon from '@components/_common/icon/Icon';
import LikeButton from '@components/_common/like-button/LikeButton';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Layout, Typo } from '@design-system';
import { Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import QuestionItem from '../question-item/QuestionItem';

interface ResponseItemProps {
  response: Response;
}

function ResponseItem({ response }: ResponseItemProps) {
  const { content, created_at, author_detail, question } = response;
  const { username } = getAuthorProfileInfo(author_detail);
  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));

  const handleClickMore = () => {
    console.log('more');
  };

  const handleClickComment = () => {
    console.log('comment');
  };

  return (
    <Layout.FlexRow w="100%" p={12} rounded={12} outline="LIGHT">
      <Layout.FlexCol h="100%">
        <ProfileImage
          imageUrl={myProfile?.profile_image}
          username={myProfile?.username}
          size={PROFILE_IMAGE_SIZE}
        />
        {/* TODO reply styles */}
      </Layout.FlexCol>
      <Layout.FlexCol ml={8} gap={8} w="100%">
        <Layout.FlexRow
          w="100%"
          alignItems="center"
          justifyContent="space-between"
          h={PROFILE_IMAGE_SIZE}
        >
          {/* author, created_at 정보 */}
          <Layout.FlexRow alignItems="center" gap={8}>
            <Typo type="title-medium">{username}</Typo>
            <Typo type="label-medium" color="MEDIUM_GRAY">
              {convertTimeDiffByString(new Date(), new Date(created_at))}
            </Typo>
          </Layout.FlexRow>
          {/* 더보기 */}
          <Layout.FlexRow>
            <Icon name="dots_menu" size={24} onClick={handleClickMore} />
          </Layout.FlexRow>
        </Layout.FlexRow>
        <Layout.FlexCol w="100%">
          <Typo type="body-large" color="BLACK">
            {content}
          </Typo>
          <Layout.FlexRow w="100%" justifyContent="flex-end" />
        </Layout.FlexCol>
        <QuestionItem question={question} />
        <Layout.FlexRow gap={18} alignItems="center">
          <LikeButton postType="Response" post={response} iconSize={24} m={0} />
          <Icon name="add_comment" size={24} onClick={handleClickComment} />
        </Layout.FlexRow>
      </Layout.FlexCol>
    </Layout.FlexRow>
  );
}

export default ResponseItem;

const PROFILE_IMAGE_SIZE = 44;
