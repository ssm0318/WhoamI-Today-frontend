import { useEffect } from 'react';
import { Layout } from '@design-system';
import { MOCK_COMMENTS } from '@mock/myDetail';
import CommentItem from './CommentItem';

interface CommentListProps {
  postType: 'Moment' | 'Response';
}

function CommentList({ postType }: CommentListProps) {
  useEffect(() => {
    // TODO: GET comments
    console.log(`GET ${postType} comments`);
  }, [postType]);

  return (
    <Layout.FlexCol w="100%" pl={8} pr={8}>
      {/* TODO: private comments */}
      {MOCK_COMMENTS.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
      {/* TODO: comment 작성 */}
    </Layout.FlexCol>
  );
}

export default CommentList;
