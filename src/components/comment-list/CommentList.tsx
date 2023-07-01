import { useEffect } from 'react';
import { Divider } from '@components/_common/divider/Divider.styled';
import { Layout } from '@design-system';
import { MOCK_COMMENTS } from '@mock/myDetail';
import CommentInputBox from './comment-input-box/CommentInputBox';
import CommentItem from './comment-item/CommentItem';

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
      <Divider width={1} marginTrailing={10} />
      <Layout.FlexCol w="100%" gap={2}>
        {/* TODO: private comments */}
        {MOCK_COMMENTS.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </Layout.FlexCol>
      <CommentInputBox />
    </Layout.FlexCol>
  );
}

export default CommentList;
