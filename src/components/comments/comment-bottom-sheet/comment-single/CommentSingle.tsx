import { useParams } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import CommentInputBox from '@components/comment-list/comment-input-box/CommentInputBox';
import CommentItem from '@components/comment-list/comment-item/CommentItem';
import { Comment, Note, Response } from '@models/post';

interface CommentProps {
  comment: Comment;
  post: Response | Comment | Note;
}
function CommentSingle({ comment, post }: CommentProps) {
  const { noteId } = useParams();

  // const post = responseList[0];
  // const comment = responseList[0].comments[0];
  console.log(comment, post);
  console.log(noteId);

  return (
    <MainContainer>
      {/* TBU */}
      <CommentItem comment={comment} />

      <CommentInputBox postType="Comment" post={post} />
      <CommentInputBox postType="Comment" post={post} isReply replyTo={comment} />
    </MainContainer>
  );
}

export default CommentSingle;
