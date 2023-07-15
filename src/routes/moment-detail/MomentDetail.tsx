import AuthorProfile from '@components/_common/author-profile/AuthorProfile';
import LikeButton from '@components/_common/like-button/LikeButton';
import CommentList from '@components/comment-list/CommentList';
import MomentContent from '@components/the-days-detail/the-days-moments/MomentContent';
import { Font, Layout } from '@design-system';
import { GetMomentDetailResponse } from '@models/api/moment';
import { User } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { convertTimeDiffByString } from '@utils/timeHelpers';

interface MomentDetailProps {
  moment: GetMomentDetailResponse;
}

function MomentDetail({ moment }: MomentDetailProps) {
  const isUserAuthor = useBoundStore((state) => state.isUserAuthor);
  const { author_detail, created_at } = moment;
  const isMomentAuthor = isUserAuthor((author_detail as User).id);

  return (
    <>
      <AuthorProfile authorDetail={author_detail} usernameFont="18_semibold" />
      <MomentContent moment={moment} />
      <Layout.FlexRow w="100%" alignItems="center" justifyContent="space-between">
        <Font.Body type="12_regular" color="GRAY_12">
          {convertTimeDiffByString(new Date(), new Date(created_at), 'yyyy.MM.dd HH:mm')}
        </Font.Body>
        <LikeButton postType="Moment" post={moment} iconSize={18} isAuthor={isMomentAuthor} />
      </Layout.FlexRow>
      <CommentList postType="Moment" post={moment} />
    </>
  );
}

export default MomentDetail;
