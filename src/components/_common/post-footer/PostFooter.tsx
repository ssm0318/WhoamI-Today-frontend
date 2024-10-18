import { EmojiClickData } from 'emoji-picker-react';
import { MouseEvent, RefObject, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import EmojiPicker from '@components/emoji-picker/EmojiPicker';
import { SCREEN_HEIGHT, TOP_NAVIGATION_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import { Note, POST_DP_TYPE, POST_TYPE, Response } from '@models/post';
import { User } from '@models/user';
import { postReaction } from '@utils/apis/reaction';
import EmojiButton from '../emoji-button/EmojiButton';
import EmojiItem from '../emoji-item/EmojiItem';
import Icon from '../icon/Icon';
import LikeButton from '../like-button/LikeButton';
import PostReactionList from '../post-reaction-list/PostReactionList';

type PostFooterProps = {
  likedUserList: User[];
  isMyPage: boolean;
  post: Response | Note;
  commentType?: POST_DP_TYPE;
  showComments: () => void;
  setInputFocus: () => void;
};

interface Position {
  top?: number;
  bottom?: number;
}

function PostFooter({
  likedUserList,
  isMyPage,
  post,
  commentType = 'LIST',
  showComments,
  setInputFocus,
}: PostFooterProps) {
  const { comment_count, type } = post;
  const navigate = useNavigate();
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [pickerPosition, setPickerPosition] = useState<Position>({});
  const postFooterWrapper = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

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

  const handlePosition = (wrapper: RefObject<HTMLElement>): Position => {
    if (!wrapper.current) return {};
    const { top, height } = wrapper.current.getBoundingClientRect();
    console.log('hanldePosition', top, height);
    if (top - TOP_NAVIGATION_HEIGHT > SCREEN_HEIGHT / 2) {
      return { bottom: height };
    }
    return { top: height };
  };

  const handleSelectEmoji = async (emoji: EmojiClickData) => {
    await postReaction(post.type, post.id, emoji.emoji);
  };

  const handleClickEmojiButton = () => {
    const { bottom, top } = handlePosition(postFooterWrapper);
    console.log('bottom', bottom);
    console.log('top', top);

    setPickerPosition({ bottom, top });

    setEmojiPickerVisible(!emojiPickerVisible);
  };

  return (
    <Layout.FlexCol gap={8} ref={postFooterWrapper}>
      <Layout.FlexRow gap={16} alignItems="center">
        {isMyPage ? (
          // 좋아요나 이모지를 누른 사용자 리스트
          likedUserList.length > 0 && (
            <button type="button" onClick={handleClickReactions}>
              <PostReactionList
                user_sample_list={likedUserList.map((user) => {
                  return {
                    ...user,
                    like: true,
                    emoji: null,
                  };
                })}
              />
            </button>
          )
        ) : (
          <>
            <LikeButton postType={type} post={post} iconSize={23} m={0} />
            {/* 내가 누른 이모지 리스트가 있으면 이모지 리스트 노출 */}
            {/* 내가 누른 이모지 리스트가 없으면 이모지 버튼 노출 */}
            {(post.current_user_emoji_list || []).length === 0 ? (
              <EmojiButton post={post} onClick={handleClickEmojiButton} />
            ) : (
              post.current_user_emoji_list.map((emoji) => (
                <EmojiItem key={emoji} emojiString={emoji} size={10} />
              ))
            )}
          </>
        )}
        <Icon name="add_comment" size={23} onClick={handleClickCommentIcon} />
      </Layout.FlexRow>
      {!!comment_count && commentType === 'LIST' && (
        <Layout.FlexRow>
          <button type="button" onClick={handleClickCommentText}>
            <Typo type="label-large" color="BLACK" underline>
              {comment_count || 0} {t('comments')}
            </Typo>
          </button>
        </Layout.FlexRow>
      )}
      <EmojiPicker
        selectedEmojis={post.current_user_emoji_list}
        onSelectEmoji={handleSelectEmoji}
        isVisible={emojiPickerVisible}
        setIsVisible={setEmojiPickerVisible}
        pickerPosition={pickerPosition}
        toggleButtonRef={toggleButtonRef}
      />
    </Layout.FlexCol>
  );
}

export default PostFooter;
