import { EmojiClickData } from 'emoji-picker-react';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import EmojiPicker from '@components/emoji-picker/EmojiPicker';
import { getEmojiPickerPosition } from '@components/emoji-picker/EmojiPicker.helper';
import { BOTTOM_TABBAR_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import { useTrackEvent } from '@hooks/useTrackEvent';
import { Note, POST_DP_TYPE, POST_TYPE, ReactionUserSample, Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { deleteReaction, postReaction } from '@utils/apis/reaction';
import EmojiButton from '../emoji-button/EmojiButton';
import Icon from '../icon/Icon';
import PostReactionList from '../post-reaction-list/PostReactionList';

type PostFooterProps = {
  post: Response | Note;
  displayType?: POST_DP_TYPE;
  showComments: () => void;
  setInputFocus: () => void;
  emojiPickerPortalId?: string;
};

function PostFooter({
  post,
  displayType = 'LIST',
  showComments,
  setInputFocus,
  emojiPickerPortalId,
}: PostFooterProps) {
  const { comment_count, type, current_user_reaction_id_list, like_reaction_user_sample } = post;
  const navigate = useNavigate();
  const toggleButtonRef = useRef<HTMLDivElement>(null);
  const [myReactionList, setMyReactionList] = useState<{ id: number; emoji: string }[]>(
    current_user_reaction_id_list,
  );
  const [sampleUserList, setSampleUserList] =
    useState<ReactionUserSample[]>(like_reaction_user_sample);
  const { emojiPickerTarget, setEmojiPickerTarget, myProfile } = useBoundStore((state) => ({
    emojiPickerTarget: state.emojiPickerTarget,
    setEmojiPickerTarget: state.setEmojiPickerTarget,
    myProfile: state.myProfile,
  }));
  const myEmojiList = myReactionList?.map((reaction) => reaction.emoji);
  const [t] = useTranslation('translation', {
    keyPrefix: post.type === POST_TYPE.RESPONSE ? 'responses' : 'notes',
  });
  const trackEvent = useTrackEvent();
  // True iff the picker was opened during this PostFooter mount and a
  // reaction was posted. Lets the close-without-pick branch fire
  // `reaction_picker_dismissed` (vs the picker being closed because the
  // user actually reacted, which we already see via postReaction).
  const pickerOpenedRef = useRef(false);
  const reactionPostedRef = useRef(false);
  // Captured at the picker_opened moment so close paths (both pick and
  // dismiss) can attach `duration_ms` — measures how long the user
  // browsed the picker before deciding (or not). Backend can't see this
  // because picker open/close fire no API calls.
  const pickerOpenedAtRef = useRef<number | null>(null);

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
    // duration from picker open → emoji pick. Tells us reaction-decision
    // hesitation time — paired with reaction itself this becomes a real
    // "how long did the user browse before reacting" metric.
    if (pickerOpenedAtRef.current !== null) {
      trackEvent('reaction_picker_dwell', {
        post_type: String(post.type),
        outcome: 'reacted',
        duration_ms: Date.now() - pickerOpenedAtRef.current,
      });
      pickerOpenedAtRef.current = null;
    }
    reactionPostedRef.current = true;
    setEmojiPickerTarget(null);
    setMyReactionList([
      ...myReactionList,
      {
        id: response.id,
        emoji: response.emoji,
      },
    ]);

    // Update emoji reaction list
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
        user_interests: myProfile.user_interests,
        user_personas: myProfile.user_personas,
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

    // Update emoji reaction list
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

    const pickerPosition = getEmojiPickerPosition({
      targetEl: toggleButtonRef.current,
      bottomAreaHeight:
        displayType === 'DETAIL' ? BOTTOM_TABBAR_HEIGHT + 100 : BOTTOM_TABBAR_HEIGHT,
    });

    if (isCurrentlyActive) {
      // Tapped the button again to close — count as a dismiss only if no
      // reaction was actually posted in this open session.
      if (pickerOpenedRef.current && !reactionPostedRef.current) {
        const duration_ms =
          pickerOpenedAtRef.current !== null ? Date.now() - pickerOpenedAtRef.current : 0;
        trackEvent('reaction_picker_dismissed', {
          post_type: String(post.type),
          source: 'toggle',
          duration_ms,
        });
        // Pair the dismissal with a dwell event so funnel queries can
        // group "reacted" and "dismissed" outcomes by browsing time.
        if (duration_ms > 0) {
          trackEvent('reaction_picker_dwell', {
            post_type: String(post.type),
            outcome: 'dismissed',
            duration_ms,
          });
        }
      }
      pickerOpenedRef.current = false;
      reactionPostedRef.current = false;
      pickerOpenedAtRef.current = null;
      setEmojiPickerTarget(null);
    } else {
      pickerOpenedRef.current = true;
      reactionPostedRef.current = false;
      pickerOpenedAtRef.current = Date.now();
      trackEvent('reaction_picker_opened', { post_type: String(post.type) });
      setEmojiPickerTarget({ type: post.type, id: post.id, ...pickerPosition });
    }
  };

  useEffect(() => {
    setMyReactionList(current_user_reaction_id_list);
  }, [current_user_reaction_id_list]);

  useEffect(() => {
    setSampleUserList(like_reaction_user_sample);
  }, [like_reaction_user_sample]);

  useEffect(() => {
    return () => {
      setEmojiPickerTarget(null);
    };
  }, [setEmojiPickerTarget]);

  return (
    <Layout.FlexRow
      gap={8}
      w="100%"
      style={{
        position: displayType === 'DETAIL' ? 'relative' : undefined,
        flexShrink: 0,
        marginTop: 'auto',
      }}
      alignItems="center"
    >
      <Layout.FlexRow alignItems="center">
        <Layout.FlexRow ref={toggleButtonRef} alignItems="center">
          <EmojiButton onClick={handleClickEmojiButton} />
        </Layout.FlexRow>
        {displayType === 'LIST' && (
          <Layout.FlexRow w={48} h={48} alignItems="center" justifyContent="center">
            <Icon name="add_comment" size={23} onClick={handleClickCommentIcon} />
          </Layout.FlexRow>
        )}
        {sampleUserList?.length > 0 && (
          <Layout.FlexRow onClick={handleClickReactions}>
            <PostReactionList user_sample_list={sampleUserList} />
          </Layout.FlexRow>
        )}
      </Layout.FlexRow>
      {!!comment_count && (
        <Layout.FlexRow>
          <button
            type="button"
            onClick={displayType === 'LIST' ? handleClickCommentText : undefined}
          >
            <Typo type="label-large" color="BLACK" underline>
              {comment_count ?? 0} {t('comments')}
            </Typo>
          </button>
        </Layout.FlexRow>
      )}
      <EmojiPicker
        postId={post.id}
        postType={post.type}
        createPortalId={emojiPickerPortalId}
        selectedEmojis={myEmojiList}
        onSelectEmoji={handleSelectEmoji}
        onUnselectEmoji={handleUnselectEmoji}
        left={displayType === 'DETAIL' ? -10 : undefined}
      />
    </Layout.FlexRow>
  );
}
export default PostFooter;
