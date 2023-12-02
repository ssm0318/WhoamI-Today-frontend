import { useState } from 'react';
import CommentList from '@components/comment-list/CommentList';
import { Font } from '@design-system';
import { GetMomentResponse } from '@models/api/moment';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import { PostFooter } from '../_styled/contentWrapper.styled';
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
      <PostFooter>
        <Font.Body type="12_regular" color="MEDIUM_GRAY">
          {convertTimeDiffByString(new Date(), new Date(moment.created_at))}
        </Font.Body>
        <ReactionButtons postType="Moment" post={moment} onClickComments={toggleComments} />
      </PostFooter>
      {showComments && <CommentList postType="Moment" post={moment} />}
    </TheDaysWrapper>
  );
}

export default TheDaysMoments;
