import { RefObject, useRef, useState } from 'react';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import Loader from '@components/_common/loader/Loader';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { DEFAULT_MARGIN, SCREEN_WIDTH, Z_INDEX } from '@constants/layout';
import { Font, Layout } from '@design-system';
import useClickOutside from '@hooks/useClickOutside';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { Reaction, ReactionPostType } from '@models/post';
import { getReactionList } from '@utils/apis/reaction';

interface EmojiViewPopupProps {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  popupPosition: { top?: number; bottom?: number };
  postType: ReactionPostType;
  postId: number;
  toggleButtonRef?: RefObject<HTMLButtonElement>;
}

function EmojiViewPopup({
  isVisible,
  setIsVisible,
  popupPosition,
  postType,
  postId,
  toggleButtonRef,
}: EmojiViewPopupProps) {
  const emojiPopupWrapper = useRef<HTMLDivElement>(null);
  const [nextPage, setNextPage] = useState<string | null | undefined>(undefined);
  const [reactions, setReactions] = useState<Reaction[]>([]);

  useClickOutside({
    ref: emojiPopupWrapper,
    toggleButtonRef,
    onClick: () => setIsVisible(false),
  });

  const { isLoading, targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (nextPage === null) return setIsLoading(false);
    await fetchReactions(nextPage ?? null);
  });

  const fetchReactions = async (page: string | null) => {
    const { results, next } = await getReactionList(postType, postId, page);
    if (!results) return;
    setNextPage(next);
    setReactions([...reactions, ...results]);
  };

  if (!isVisible) return null;
  return (
    <Layout.Absolute
      t={popupPosition.top}
      b={popupPosition.bottom}
      ref={emojiPopupWrapper}
      l={DEFAULT_MARGIN}
      z={Z_INDEX.MODAL_CONTAINER}
      outline="BLACK"
      w={POPUP_WIDTH}
      p="default"
      bgColor="BACKGROUND_COLOR"
      rounded={14}
    >
      <Layout.FlexCol
        w={POPUP_WIDTH}
        style={{
          maxHeight: POPUP_MAX_HEIGHT,
        }}
        gap={12}
      >
        {reactions.map((data) => (
          <Layout.FlexRow key={data.id} alignItems="center" justifyContent="space-between" w="100%">
            <Layout.FlexRow alignItems="center">
              <ProfileImage
                imageUrl={data.user.profile_image}
                username={data.user.username}
                size={30}
              />
              <Font.Body type="14_semibold">{data.user.username}</Font.Body>
            </Layout.FlexRow>
            <Layout.FlexRow>
              <EmojiItem emojiString={data.emoji} size={20} />
            </Layout.FlexRow>
          </Layout.FlexRow>
        ))}
        <div ref={targetRef} />
        {isLoading && (
          <Layout.FlexRow w="100%" h={40}>
            <Loader />
          </Layout.FlexRow>
        )}
      </Layout.FlexCol>
    </Layout.Absolute>
  );
}

export const POPUP_WIDTH = SCREEN_WIDTH - 2 * DEFAULT_MARGIN;
export const POPUP_MAX_HEIGHT = 500;

export default EmojiViewPopup;
