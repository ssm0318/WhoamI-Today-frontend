import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import Loader from '@components/_common/loader/Loader';
import Popup from '@components/_common/popup/Popup';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Layout, Typo } from '@design-system';
import { Reaction } from '@models/post';
import { getReactionList } from '@utils/apis/reaction';

interface CommentReactionsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  commentId: number;
  onClickUser: (username: string) => void;
}

function CommentReactionsPopup({
  isOpen,
  onClose,
  commentId,
  onClickUser,
}: CommentReactionsPopupProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'comment' });
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setReactions([]);
      return;
    }
    setIsLoading(true);
    getReactionList('Comment', commentId)
      .then(({ results }) => {
        setReactions(results ?? []);
      })
      .finally(() => setIsLoading(false));
  }, [isOpen, commentId]);

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <Layout.FlexCol w="100%" bgColor="WHITE" rounded={16}>
        <Layout.FlexRow w="100%" h={56} ph={20} alignItems="center" justifyContent="center">
          <Typo type="title-medium" bold>
            {t('reactions_title', 'Reactions')}
          </Typo>
        </Layout.FlexRow>
        <Layout.FlexCol w="100%" ph={16} style={{ overflowY: 'auto', maxHeight: 280 }}>
          {reactions.map((reaction) => {
            const { id, user, emoji } = reaction;
            return (
              <Layout.FlexRow
                alignItems="center"
                justifyContent="space-between"
                pv={6}
                pr={8}
                w="100%"
                key={id}
                onClick={() => onClickUser(user.username)}
              >
                <Layout.FlexRow gap={10} alignItems="center">
                  <ProfileImage imageUrl={user.profile_image} username={user.username} size={36} />
                  <Typo type="title-medium">{user.username}</Typo>
                </Layout.FlexRow>
                <EmojiItem
                  emojiString={emoji}
                  size={24}
                  bgColor="TRANSPARENT"
                  outline="TRANSPARENT"
                />
              </Layout.FlexRow>
            );
          })}
          {isLoading && (
            <Layout.FlexRow w="100%" h={40}>
              <Loader />
            </Layout.FlexRow>
          )}
        </Layout.FlexCol>
      </Layout.FlexCol>
    </Popup>
  );
}

export default CommentReactionsPopup;
