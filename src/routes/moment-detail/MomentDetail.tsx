import AuthorProfile from '@components/_common/author-profile/AuthorProfile';
import LikeButton from '@components/_common/like-button/LikeButton';
import CommentList from '@components/comment-list/CommentList';
import MomentContent from '@components/the-days-detail/the-days-moments/MomentContent';
import { Font, Layout } from '@design-system';
import { GetMomentDetailResponse } from '@models/api/moment';
import { convertTimeDiffByString } from '@utils/timeHelpers';

interface MomentDetailProps {
  moment: GetMomentDetailResponse;
}

function MomentDetail({ moment }: MomentDetailProps) {
  const { author_detail, created_at } = moment;

  return (
    <>
      <AuthorProfile authorDetail={author_detail} usernameFont="18_semibold" />
      <MomentContent moment={moment} />
      <Layout.FlexRow w="100%" alignItems="center" justifyContent="space-between">
        <Font.Body type="12_regular" color="MEDIUM_GRAY">
          {convertTimeDiffByString(new Date(), new Date(created_at), 'yyyy.MM.dd HH:mm')}
        </Font.Body>
        <LikeButton postType="Moment" post={moment} iconSize={18} />
      </Layout.FlexRow>
      <CommentList postType="Moment" post={moment} />
    </>
  );
}

export default MomentDetail;
