import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAuthorProfileInfo } from '@components/_common/author-profile/AuthorProfile.helper';
import Icon from '@components/_common/icon/Icon';
import LikeButton from '@components/_common/like-button/LikeButton';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Layout, Typo } from '@design-system';
import { Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import QuestionItem from '../question-item/QuestionItem';
import { ReplyWrapper } from './ResponseItem.styled';

interface ResponseItemProps {
  response: Response;
}

function ResponseItem({ response }: ResponseItemProps) {
  const { content, created_at, author_detail, question, like_count, comment_count } = response;
  const { username } = getAuthorProfileInfo(author_detail);
  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [replyHeight, setReplyHeight] = useState<number>(0);
  const [t] = useTranslation('translation', { keyPrefix: 'responses' });

  const handleClickMore = () => {
    // TODO
    console.log('more');
  };

  const handleClickComment = () => {
    // TODO
    console.log('comment');
  };

  useEffect(() => {
    if (wrapperRef.current) {
      setReplyHeight(
        wrapperRef.current.clientHeight -
          2 * WRAPPER_PADDING -
          PROFILE_IMAGE_SIZE -
          BOTTOM_ICON_SECTION_HEIGHT * 2,
      );
    }
  }, []);

  return (
    <Layout.FlexRow
      w="100%"
      p={WRAPPER_PADDING}
      rounded={12}
      outline="LIGHT"
      h="100%"
      ref={wrapperRef}
    >
      <Layout.FlexCol h="100%" alignItems="flex-end">
        <ProfileImage
          imageUrl={myProfile?.profile_image}
          username={myProfile?.username}
          size={PROFILE_IMAGE_SIZE}
        />
        <ReplyWrapper h={replyHeight} w="50%" mt={8} />
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
          <LikeButton
            postType="Response"
            post={response}
            iconSize={BOTTOM_ICON_SECTION_HEIGHT}
            m={0}
          />
          <Icon name="add_comment" size={BOTTOM_ICON_SECTION_HEIGHT} onClick={handleClickComment} />
        </Layout.FlexRow>
        <Layout.FlexRow>
          <Typo type="label-large" color="BLACK">
            {like_count || 0} {t('likes')}
            {' ・ '}
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
