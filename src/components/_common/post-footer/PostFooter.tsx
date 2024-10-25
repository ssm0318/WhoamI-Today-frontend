/* eslint-disable */
import EmojiPicker from '@components/emoji-picker/EmojiPicker';
import { Layout, Typo } from '@design-system';
import { Note, POST_DP_TYPE, POST_TYPE, ReactionUserSample, Response } from '@models/post';
import { postReaction } from '@utils/apis/reaction';
import { EmojiClickData } from 'emoji-picker-react';
import { MouseEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import EmojiButton from '../emoji-button/EmojiButton';
import Icon from '../icon/Icon';
import LikeButton from '../like-button/LikeButton';
import PostMyEmojiList from '../post-my-emoji-list/PostMyEmojiList';
import PostReactionList from '../post-reaction-list/PostReactionList';

type PostFooterProps = {
  reactionSampleUserList: ReactionUserSample[];
  isMyPage: boolean;
  post: Response | Note;
  commentType?: POST_DP_TYPE;
  showComments: () => void;
  setInputFocus: () => void;
};

function PostFooter({
  reactionSampleUserList: sampleUserList,
  isMyPage,
  post,
  commentType = 'LIST',
  showComments,
  setInputFocus,
}: PostFooterProps) {
  const { comment_count, type, current_user_reaction_id_list } = post;
  const navigate = useNavigate();
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const toggleButtonRef = useRef<HTMLDivElement>(null);

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
    await postReaction(post.type, post.id, emoji.emoji);
  };

  const handleClickEmojiButton = () => {
    setEmojiPickerVisible(!emojiPickerVisible);
  };

  return (
    <Layout.FlexCol gap={8} outline="BLACK" w="100%">
      <Layout.FlexRow gap={10} alignItems="center">
        {isMyPage ? (
          // 좋아요나 이모지를 누른 사용자 리스트
          sampleUserList.length > 0 && (
            <Layout.FlexRow onClick={handleClickReactions}>
              <PostReactionList user_sample_list={sampleUserList} />
            </Layout.FlexRow>
          )
        ) : (
          <>
            <LikeButton postType={type} post={post} iconSize={23} m={0} />
            <Layout.FlexRow ref={toggleButtonRef}>
              {(current_user_reaction_id_list || []).length === 0 ? (
                <EmojiButton post={post} onClick={handleClickEmojiButton} />
              ) : (
                <PostMyEmojiList
                  onClick={handleClickEmojiButton}
                  emojiList={current_user_reaction_id_list.map((reaction) => reaction.emoji)}
                />
              )}
            </Layout.FlexRow>
          </>
        )}
        <Icon name="add_comment" size={23} onClick={handleClickCommentIcon} />
      </Layout.FlexRow>
      {!!comment_count && commentType === 'LIST' && (
        <Layout.FlexRow>
          <button type="button" onClick={handleClickCommentText}>
            <Typo type="label-large" color="BLACK" underline>
              {comment_count ?? 0} {t('comments')}
            </Typo>
          </button>
        </Layout.FlexRow>
      )}
      <EmojiPicker
        selectedEmojis={current_user_reaction_id_list.map((reaction) => reaction.emoji)}
        onSelectEmoji={handleSelectEmoji}
        isVisible={emojiPickerVisible}
        setIsVisible={setEmojiPickerVisible}
        toggleButtonRef={toggleButtonRef}
        height={commentType === 'LIST' ? 200 : 150}
      />
    </Layout.FlexCol>
  );
}
export default PostFooter;
