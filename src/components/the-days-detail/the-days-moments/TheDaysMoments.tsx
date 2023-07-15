import { useState } from 'react';
import CommentList from '@components/comment-list/CommentList';
import { Layout } from '@design-system';
import { GetMomentResponse } from '@models/api/moment';
import ReactionButtons from '../reaction-buttons/ReactionButtons';
import TheDaysWrapper from '../the-days-wrapper/TheDaysWrapper';
import MomentContent from './MomentContent';

interface TheDaysMomentsProps {
  moment: GetMomentResponse;
  useDeleteButton?: boolean;
  reloadMoment?: () => void;
}

function TheDaysMoments({ moment, useDeleteButton, reloadMoment }: TheDaysMomentsProps) {
  const [showComments, setShowComments] = useState(false);

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  return (
    <TheDaysWrapper type="moments">
      <MomentContent
        moment={moment}
        useDeleteButton={useDeleteButton}
        reloadMoment={reloadMoment}
      />
      <Layout.FlexRow w="100%" justifyContent="flex-end" pt={6} pr={8} pb={6}>
        <ReactionButtons
          postType="Moment"
          post={moment}
          isAuthor={useDeleteButton} // FIXME: 사용자 작성글인지 구분
          onClickComments={toggleComments}
        />
      </Layout.FlexRow>
      {showComments && <CommentList postType="Moment" post={moment} />}
    </TheDaysWrapper>
  );
}

export default TheDaysMoments;
