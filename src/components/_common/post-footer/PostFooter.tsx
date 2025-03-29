import { EmojiClickData } from 'emoji-picker-react';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import EmojiPicker from '@components/emoji-picker/EmojiPicker';
import {
  getEmojiPickerHeight,
  getEmojiPickerPosition,
} from '@components/emoji-picker/EmojiPicker.helper';
import { Layout, Typo } from '@design-system';
import { Note, POST_DP_TYPE, POST_TYPE, ReactionUserSample, Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { deleteReaction, postReaction } from '@utils/apis/reaction';
import EmojiButton from '../emoji-button/EmojiButton';
import Icon from '../icon/Icon';
import LikeButton from '../like-button/LikeButton';
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
  reactionSampleUserList: initialReactionSampleUserList,
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
  const [sampleUserList, setSampleUserList] = useState<ReactionUserSample[]>(
    initialReactionSampleUserList,
  );
  const { emojiPickerTarget, setEmojiPickerTarget, myProfile } = useBoundStore((state) => ({
    emojiPickerTarget: state.emojiPickerTarget,
    setEmojiPickerTarget: state.setEmojiPickerTarget,
    myProfile: state.myProfile,
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
    if (!myProfile) return;
    const response = await postReaction(post.type, post.id, emoji.emoji);

    setEmojiPickerTarget(null);
    setMyReactionList([
      ...myReactionList,
      {
        id: response.id,
        emoji: response.emoji,
      },
    ]);

    // 이모지 리액션 목록 업데이트
    setSampleUserList((prev) => {
      const newSample: ReactionUserSample = {
        id: myProfile.id,
        like: false,
        reaction: emoji.emoji,
        profile_image: myProfile.profile_image,
        profile_pic: myProfile.profile_pic,
        url: myProfile.url,
        username: myProfile.username,
        bio: myProfile.bio,
        pronouns: myProfile.pronouns,
        persona: myProfile.persona,
        connection_status: myProfile.connection_status,
      };
      return [...prev, newSample];
    });
  };

  const handleUnselectEmoji = async (emoji: EmojiClickData) => {
    if (!myProfile) return;
    const targetReaction = myReactionList.find((reaction) => reaction.emoji === emoji.emoji);

    if (!targetReaction) return;
    await deleteReaction(targetReaction.id);
    setMyReactionList(myReactionList.filter((reaction) => reaction.emoji !== emoji.emoji));

    // 이모지 리액션 목록 업데이트
    setSampleUserList((prev) => {
      return prev.filter(
        (sample) => !(sample.reaction === emoji.emoji && sample.id === myProfile.id),
      );
    });
  };

  const handleClickEmojiButton = () => {
    const isCurrentlyActive =
      emojiPickerTarget?.type === post.type && emojiPickerTarget?.id === post.id;

    if (!toggleButtonRef.current) return;

    const pickerPosition = getEmojiPickerPosition(toggleButtonRef.current, emojiPickerHeight);

    setEmojiPickerTarget(
      isCurrentlyActive ? null : { type: post.type, id: post.id, ...pickerPosition },
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
        {!isMyPage && (
          <>
            <LikeButton postType={type} post={post} iconSize={23} m={0} />
            <Layout.FlexRow ref={toggleButtonRef} alignItems="center">
              {(myEmojiList || []).length === 0 ? (
                <EmojiButton post={post} onClick={handleClickEmojiButton} />
              ) : (
                <>
                  {/* <PostMyEmojiList emojiList={myEmojiList} /> */}
                  <EmojiButton post={post} onClick={handleClickEmojiButton} />
                </>
              )}
            </Layout.FlexRow>
          </>
        )}
        <Icon name="add_comment" size={23} onClick={handleClickCommentIcon} />
        {sampleUserList?.length > 0 && (
          <Layout.FlexRow onClick={handleClickReactions}>
            <PostReactionList user_sample_list={sampleUserList} />
          </Layout.FlexRow>
        )}
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
        createPortalId={
          displayType === 'LIST' && post.type === 'Response'
            ? 'response_section_emoji_picker'
            : undefined
        }
        selectedEmojis={myEmojiList}
        onSelectEmoji={handleSelectEmoji}
        onUnselectEmoji={handleUnselectEmoji}
        height={emojiPickerHeight}
        left={displayType === 'DETAIL' ? -10 : undefined}
        post={post}
      />
    </Layout.FlexCol>
  );
}
export default PostFooter;
