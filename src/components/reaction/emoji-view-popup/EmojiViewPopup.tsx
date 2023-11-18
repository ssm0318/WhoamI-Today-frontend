import { useRef } from 'react';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { DEFAULT_MARGIN, SCREEN_WIDTH, Z_INDEX } from '@constants/layout';
import { Font, Layout } from '@design-system';
import useClickOutside from '@hooks/useClickOutside';
import { User } from '@models/user';
import EmojiItem from '../../_common/emoji-item/EmojiItem';

interface EmojiData {
  id: number;
  emoji: string;
  user: User;
}

// TODO(Gina): 실제 데이터로 바꾸기
const mockEmojiDataList: EmojiData[] = [
  {
    id: 1,
    emoji: '🥰',
    user: {
      id: 1,
      username: '김민수',
      profile_image: '',
      profile_pic: '',
      url: '',
    },
  },
  {
    id: 2,
    emoji: '😋',
    user: {
      id: 2,
      username: '이철수',
      profile_image: '',
      profile_pic: '',
      url: '',
    },
  },
];

interface EmojiViewPopupProps {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  popupPosition: { top?: number; bottom?: number };
}

function EmojiViewPopup({ isVisible, setIsVisible, popupPosition }: EmojiViewPopupProps) {
  const emojiPopupWrapper = useRef<HTMLDivElement>(null);

  useClickOutside({ ref: emojiPopupWrapper, onClick: () => setIsVisible(false) });

  if (!isVisible) return null;
  return (
    <Layout.Absolute
      t={popupPosition.top}
      b={popupPosition.bottom}
      ref={emojiPopupWrapper}
      l={DEFAULT_MARGIN}
      z={Z_INDEX.MODAL_CONTAINER}
      outline="BASIC_BLACK"
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
        {mockEmojiDataList.map((data) => (
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
      </Layout.FlexCol>
    </Layout.Absolute>
  );
}

export const POPUP_WIDTH = SCREEN_WIDTH - 2 * DEFAULT_MARGIN;
export const POPUP_MAX_HEIGHT = 500;

export default EmojiViewPopup;
