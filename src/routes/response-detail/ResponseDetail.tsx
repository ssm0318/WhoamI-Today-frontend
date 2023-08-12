import AuthorProfile from '@components/_common/author-profile/AuthorProfile';
import LikeButton from '@components/_common/like-button/LikeButton';
import CommentList from '@components/comment-list/CommentList';
import { Font, Layout } from '@design-system';
import { GetResponseDetailResponse } from '@models/api/response';
import { User } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { convertTimeDiffByString } from '@utils/timeHelpers';

interface ResponseDetailProps {
  response: GetResponseDetailResponse;
}

function ResponseDetail({ response }: ResponseDetailProps) {
  const isUserAuthor = useBoundStore((state) => state.isUserAuthor);
  const { author_detail, created_at } = response;
  const isResponseAuthor = isUserAuthor((author_detail as User).id);

  return (
    <>
      <AuthorProfile authorDetail={author_detail} usernameFont="18_semibold" />
      <Layout.FlexCol w="100%" bgColor="BASIC_DISABLED_SOFT" rounded={12} pv={14} ph={20}>
        <Font.Display type="18_bold" color="GRAY_3">
          {response.question.content}
        </Font.Display>
      </Layout.FlexCol>
      <Layout.FlexCol pl={6}>
        <Font.Body type="18_regular">{response.content}</Font.Body>
      </Layout.FlexCol>
      <Layout.FlexRow w="100%" alignItems="center" justifyContent="space-between">
        <Font.Body type="12_regular" color="GRAY_12">
          {convertTimeDiffByString(new Date(), new Date(created_at), 'yyyy.MM.dd HH:mm')}
        </Font.Body>
        <LikeButton postType="Response" post={response} iconSize={18} isAuthor={isResponseAuthor} />
      </Layout.FlexRow>
      <CommentList postType="Response" post={response} />
    </>
  );
}

export default ResponseDetail;
