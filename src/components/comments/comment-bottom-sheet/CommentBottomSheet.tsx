import { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import Divider from '@components/_common/divider/Divider';
import Icon from '@components/_common/icon/Icon';
import CommentInputBox from '@components/comment-list/comment-input-box/CommentInputBox';
import CommentItem from '@components/comment-list/comment-item/CommentItem';
import { getCommentList } from '@components/comment-list/CommentList.helper';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { responseList } from '@mock/responses';
import { Comment } from '@models/post';

interface Props {
  id: number;
  visible: boolean;
  closeBottomSheet: () => void;
}

function CommentBottomSheet({ id, visible, closeBottomSheet }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'comment' });

  const postType = 'Note';
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyTo, setReplyTo] = useState<Comment>();
  const comment = responseList[0].comments[0];
  const post = responseList[0];

  const getComments = useCallback(async () => {
    const commentList = await getCommentList(postType, id, null);
    setComments(JSON.parse(JSON.stringify(commentList)));
  }, [id]);

  useAsyncEffect(async () => {
    await getComments();
  }, []);
  //   useAsyncEffect(await getComments, [getComments]);

  const handleClick = () => {
    closeBottomSheet();
  };

  return createPortal(
    <BottomModal visible={visible} onClose={closeBottomSheet} h={650} maxHeight={650}>
      <Layout.FlexCol pb={10} w="100%" bgColor="WHITE">
        <Layout.FlexRow w="100%" justifyContent="center">
          <Icon name="home_indicator" />
        </Layout.FlexRow>
        <Layout.FlexRow w="100%" h="100%">
          <Layout.FlexRow onClick={handleClick} pl={20}>
            <Typo type="title-large">{t('cancel')}</Typo>
          </Layout.FlexRow>
          <Layout.FlexRow
            style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
          >
            <Typo type="title-large">{t('comment')}</Typo>
          </Layout.FlexRow>
        </Layout.FlexRow>
        <Layout.FlexCol gap={12} pt={12} w="100%">
          <Divider width={1} />
        </Layout.FlexCol>
      </Layout.FlexCol>
      <Layout.FlexCol w="100%" p={15}>
        {/* api용 */}
        {comments && <CommentItem comment={comment} />}

        <CommentItem
          comment={comment}
          onClickReplyBtn={() => {
            setReplyTo(comment);
          }}
        />

        {!replyTo ? (
          <CommentInputBox postType="Comment" post={post} />
        ) : (
          <CommentInputBox
            postType="Comment"
            post={post}
            isReply
            replyTo={replyTo}
            setReplyTo={() => {
              setReplyTo(undefined);
            }}
          />
        )}
      </Layout.FlexCol>
    </BottomModal>,
    document.getElementById('root-container') || document.body,
  );
}

export default CommentBottomSheet;