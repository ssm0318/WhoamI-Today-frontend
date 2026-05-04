import ReactEmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { CSSProperties, MouseEvent, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { EMOJI_CATEGORIES } from '@components/emoji-picker/EmojiPicker.constants';
import { SCREEN_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import { useTrackEvent } from '@hooks/useTrackEvent';
import { Note, POST_DP_TYPE, POST_TYPE, ReactionUserSample, Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { deleteReaction, postReaction } from '@utils/apis/reaction';
import { getUnifiedEmoji } from '@utils/emojiHelpers';
import BottomModal from '../bottom-modal/BottomModal';
import EmojiButton from '../emoji-button/EmojiButton';
import Icon from '../icon/Icon';
import PostReactionList from '../post-reaction-list/PostReactionList';

const PostEmojiHighlight = createGlobalStyle<{ unifiedList: string[] }>`
  ${({ unifiedList }) =>
    unifiedList.map(
      (unified) => `
      .comment-emoji-picker [data-unified='${unified}'] {
        background-color: #C8EEFF !important;
        border-radius: 50% !important;
      }
    `,
    )}
`;

type PostFooterProps = {
  post: Response | Note;
  displayType?: POST_DP_TYPE;
  showComments: () => void;
  setInputFocus: () => void;
};

function PostFooter({ post, displayType = 'LIST', showComments, setInputFocus }: PostFooterProps) {
  const { comment_count, type, current_user_reaction_id_list, like_reaction_user_sample } = post;
  const navigate = useNavigate();
  const [myReactionList, setMyReactionList] = useState<{ id: number; emoji: string }[]>(
    current_user_reaction_id_list,
  );
  const [sampleUserList, setSampleUserList] =
    useState<ReactionUserSample[]>(like_reaction_user_sample);
  const { myProfile } = useBoundStore((state) => ({
    myProfile: state.myProfile,
  }));
  const myEmojiList = myReactionList?.map((reaction) => reaction.emoji);
  const unifiedEmojiList = (myEmojiList || []).map((e) => getUnifiedEmoji(e));
  const [t] = useTranslation('translation', {
    keyPrefix: post.type === POST_TYPE.RESPONSE ? 'responses' : 'notes',
  });
  const trackEvent = useTrackEvent();
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

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

  const handleEmojiClick = useCallback(
    async (emoji: EmojiClickData) => {
      if (!myProfile) return;
      const isAlreadySelected = (myEmojiList || []).includes(emoji.emoji);

      if (isAlreadySelected) {
        const targetReaction = myReactionList.find((r) => r.emoji === emoji.emoji);
        if (!targetReaction) return;
        await deleteReaction(targetReaction.id);
        setMyReactionList((prev) => prev.filter((r) => r.emoji !== emoji.emoji));
        setSampleUserList((prev) =>
          prev.filter((s) => !(s.reaction === emoji.emoji && s.id === myProfile.id)),
        );
      } else {
        const response = await postReaction(post.type, post.id, emoji.emoji);
        trackEvent('reaction_posted', { post_type: String(post.type) });
        setMyReactionList((prev) => [...prev, { id: response.id, emoji: response.emoji }]);
        setSampleUserList((prev) => [
          ...prev,
          {
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
          },
        ]);
      }
      setIsEmojiPickerOpen(false);
    },
    [myEmojiList, myProfile, myReactionList, post.id, post.type, trackEvent],
  );

  const handleClickEmojiButton = () => {
    setIsEmojiPickerOpen(true);
  };

  useEffect(() => {
    setMyReactionList(current_user_reaction_id_list);
  }, [current_user_reaction_id_list]);

  useEffect(() => {
    setSampleUserList(like_reaction_user_sample);
  }, [like_reaction_user_sample]);

  const canOpenCommentsInline = displayType !== 'DETAIL';

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
        <EmojiButton onClick={handleClickEmojiButton} />
        {canOpenCommentsInline && (
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
            onClick={canOpenCommentsInline ? handleClickCommentText : undefined}
          >
            <Typo type="label-large" color="BLACK" underline>
              {comment_count ?? 0} {t('comments')}
            </Typo>
          </button>
        </Layout.FlexRow>
      )}
      {isEmojiPickerOpen &&
        createPortal(
          <BottomModal
            visible={isEmojiPickerOpen}
            onClose={() => setIsEmojiPickerOpen(false)}
            customHeight={Math.round(SCREEN_HEIGHT * 0.55)}
            draggable
          >
            <Layout.FlexCol w="100%" h="100%">
              <PostEmojiHighlight unifiedList={unifiedEmojiList} />
              <ReactEmojiPicker
                width="100%"
                height="100%"
                onEmojiClick={handleEmojiClick}
                autoFocusSearch={false}
                skinTonesDisabled
                searchPlaceHolder="Search emoji"
                previewConfig={{ showPreview: false }}
                categories={EMOJI_CATEGORIES}
                lazyLoadEmojis
                className="comment-emoji-picker"
                style={
                  {
                    '--epr-emoji-size': '28px',
                    '--epr-emoji-padding': '10px',
                    '--epr-search-input-height': '46px',
                    '--epr-header-padding': '8px var(--epr-horizontal-padding)',
                  } as CSSProperties
                }
              />
            </Layout.FlexCol>
          </BottomModal>,
          document.getElementById('modal-container') || document.body,
        )}
    </Layout.FlexRow>
  );
}
export default PostFooter;
