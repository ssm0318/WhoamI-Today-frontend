import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '@components/_common/loader/Loader';
import MainContainer from '@components/_common/main-container/MainContainer';
import CommentInputBox from '@components/comment-list/comment-input-box/CommentInputBox';
import CommentItem from '@components/comment-list/comment-item/CommentItem';
import NoteItem from '@components/note/note-item/NoteItem';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { Comment, Note } from '@models/post';
import { getNoteComments, getNoteDetail } from '@utils/apis/note';

function NoteDetail() {
  const { noteId } = useParams();
  const [noteDetail, setNoteDetail] = useState<Note | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentNextPage, setCommentNextPage] = useState<string | null | undefined>(undefined);

  const { isLoading, targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (commentNextPage === null) return setIsLoading(false);
    await fetchComments(commentNextPage ?? null);
  });

  const fetchComments = async (page: string | null) => {
    const { results, next } = await getNoteComments(Number(noteId), page);
    if (!results) return;
    setCommentNextPage(next);
    setComments([...comments, ...results]);
    setIsLoading(false);
  };

  useAsyncEffect(async () => {
    if (!noteId) return;
    setNoteDetail(await getNoteDetail(Number(noteId)));
  }, [noteId]);

  if (!noteDetail) return null;
  return (
    <MainContainer>
      <SubHeader title="title" />
      <Layout.FlexCol w="100%" alignItems="center" mt={TITLE_HEADER_HEIGHT}>
        {/* TODO isMyPage 변경 */}
        <NoteItem note={noteDetail} isMyPage={false} enableCollapse={false} />
        {/* Comment List Section */}
        <Layout.FlexCol mt={24}>
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
          <div ref={targetRef} />
          {isLoading && (
            <Layout.FlexRow w="100%" h={40}>
              <Loader />
            </Layout.FlexRow>
          )}
        </Layout.FlexCol>
      </Layout.FlexCol>
      {/* Comment Write Section */}
      <Layout.Absolute b={0} w="100%" bgColor="ERROR">
        <Layout.FlexRow w="100%" bgColor="ERROR">
          <CommentInputBox isReply={false} postType="Note" post={noteDetail} />
        </Layout.FlexRow>
      </Layout.Absolute>
    </MainContainer>
  );
}

export default NoteDetail;
