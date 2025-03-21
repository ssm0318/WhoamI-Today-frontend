import { EmojiClickData } from 'emoji-picker-react';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import EmojiPicker from '@components/emoji-picker/EmojiPicker';
import {
  getEmojiPickerDirection,
  getEmojiPickerHeight,
} from '@components/emoji-picker/EmojiPicker.helper';
import { Layout, Typo } from '@design-system';
import { Note, POST_DP_TYPE, POST_TYPE, ReactionUserSample, Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { deleteReaction, postReaction } from '@utils/apis/reaction';
import EmojiButton from '../emoji-button/EmojiButton';
import Icon from '../icon/Icon';
import LikeButton from '../like-button/LikeButton';
import PostMyEmojiList from '../post-my-emoji-list/PostMyEmojiList';
import PostReactionList from '../post-reaction-list/PostReactionList';

type PostFooterProps = {
  reactionSampleUserList: ReactionUserSample[];
  isMyPage: boolean;
  post: Response | Note;
  displayType?: POST_DP_TYPE;
  showComments: () => void;
  setInputFocus: () => void;
};

function PostFooter({
  reactionSampleUserList: sampleUserList,
  isMyPage,
  post,
  displayType = 'LIST',
  showComments,
  setInputFocus,
}: PostFooterProps) {
  const { comment_count, type, current_user_reaction_id_list } = post;
  const navigate = useNavigate();
  const toggleButtonRef = useRef<HTMLDivElement>(null);
  const emojiPickerHeight = getEmojiPickerHeight(displayType === 'LIST');
  const [myReactionList, setMyReactionList] = useState<{ id: number; emoji: string }[]>(
    current_user_reaction_id_list,
  );
  const { emojiPickerTarget, setEmojiPickerTarget } = useBoundStore((state) => ({
    emojiPickerTarget: state.emojiPickerTarget,
    setEmojiPickerTarget: state.setEmojiPickerTarget,
  }));
  const myEmojiList = myReactionList?.map((reaction) => reaction.emoji);
  const [t] = useTranslation('translation', {
    keyPrefix: post.type === POST_TYPE.RESPONSE ? 'responses' : 'notes',
  });

  const handleClickCommentText = (e: MouseEvent) => {
    e.stopPropagation();
    showComments();
  };

  const handleClickCommentIcon = (e: MouseEvent) => {
    e.stopPropagation();
    showComments();
    setInputFocus();
  };

  const handleClickReactions = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(
      type === 'Response' ? `/responses/${post.id}/reactions` : `/notes/${post.id}/reactions`,
    );
  };

  const handleSelectEmoji = async (emoji: EmojiClickData) => {
    const response = await postReaction(post.type, post.id, emoji.emoji);

    setEmojiPickerTarget(null);
    setMyReactionList([
      ...myReactionList,
      {
        id: response.id,
        emoji: response.emoji,
      },
    ]);
  };

  const handleUnselectEmoji = async (emoji: EmojiClickData) => {
    const targetReaction = myReactionList.find((reaction) => reaction.emoji === emoji.emoji);

    if (!targetReaction) return;
    await deleteReaction(targetReaction.id);
    setMyReactionList(myReactionList.filter((reaction) => reaction.emoji !== emoji.emoji));
  };

  const handleClickEmojiButton = () => {
    const isCurrentlyActive =
      emojiPickerTarget?.type === post.type && emojiPickerTarget?.id === post.id;
    const pickerDirection = getEmojiPickerDirection(toggleButtonRef.current, emojiPickerHeight);

    setEmojiPickerTarget(
      isCurrentlyActive ? null : { type: post.type, id: post.id, direction: pickerDirection },
    );
  };

  useEffect(() => {
    setMyReactionList(current_user_reaction_id_list);
  }, [current_user_reaction_id_list]);

  useEffect(() => {
    return () => {
      setEmojiPickerTarget(null);
    };
  }, [setEmojiPickerTarget]);

  return (
    <Layout.FlexCol
      gap={8}
      w="100%"
      style={{
        position: displayType === 'DETAIL' ? 'relative' : undefined,
      }}
    >
      <Layout.FlexRow gap={10} alignItems="center">
        {sampleUserList?.length > 0 && (
          <Layout.FlexRow onClick={handleClickReactions}>
            <PostReactionList user_sample_list={sampleUserList} />
          </Layout.FlexRow>
        )}
        {!isMyPage && (
          <>
            <LikeButton postType={type} post={post} iconSize={23} m={0} />
            <Layout.FlexRow ref={toggleButtonRef} alignItems="center">
              {(myEmojiList || []).length === 0 ? (
                <EmojiButton post={post} onClick={handleClickEmojiButton} />
              ) : (
                <>
                  <PostMyEmojiList emojiList={myEmojiList} />
                  <EmojiButton post={post} onClick={handleClickEmojiButton} />
                </>
              )}
            </Layout.FlexRow>
          </>
        )}
        <Icon name="add_comment" size={23} onClick={handleClickCommentIcon} />
      </Layout.FlexRow>
      {!!comment_count && displayType === 'LIST' && (
        <Layout.FlexRow>
          <button type="button" onClick={handleClickCommentText}>
            <Typo type="label-large" color="BLACK" underline>
              {comment_count ?? 0} {t('comments')}
            </Typo>
          </button>
        </Layout.FlexRow>
      )}
      <EmojiPicker
        selectedEmojis={myEmojiList}
        onSelectEmoji={handleSelectEmoji}
        onUnselectEmoji={handleUnselectEmoji}
        height={emojiPickerHeight}
        left={displayType === 'DETAIL' ? -10 : undefined}
        top={(toggleButtonRef?.current?.getBoundingClientRect()?.height ?? 0) + 6}
        post={post}
      />
    </Layout.FlexCol>
  );
}
export default PostFooter;
