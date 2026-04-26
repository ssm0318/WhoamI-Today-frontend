import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Layout, Typo } from '@design-system';
import { Connection } from '@models/api/friends';
import { User } from '@models/user';
import { getFriendList } from '@utils/apis/user';
import * as S from './ViewAsPicker.styled';

export type ViewAsSelection = { kind: 'tier'; tier: 'public' } | { kind: 'user'; username: string };

interface ViewAsPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (selection: ViewAsSelection) => void;
}

function ViewAsPicker({ visible, onClose, onSelect }: ViewAsPickerProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'view_as.picker' });
  const [friends, setFriends] = useState<User[] | null>(null);

  useEffect(() => {
    if (!visible || friends !== null) return;
    let cancelled = false;
    getFriendList()
      .then((res) => {
        if (cancelled) return;
        const list = Array.isArray((res as any).results)
          ? (res as any).results
          : (res as unknown as User[]);
        setFriends(list);
      })
      .catch(() => {
        if (!cancelled) setFriends([]);
      });
    return () => {
      cancelled = true;
    };
  }, [visible, friends]);

  const closeFriends = (friends ?? []).filter(
    (f) => f.connection_status === Connection.CLOSE_FRIEND,
  );
  const regularFriends = (friends ?? []).filter((f) => f.connection_status === Connection.FRIEND);

  const handleSelectPublic = () => {
    onSelect({ kind: 'tier', tier: 'public' });
    onClose();
  };

  const handleSelectFriend = (username: string) => {
    onSelect({ kind: 'user', username });
    onClose();
  };

  return (
    <BottomModal visible={visible} onClose={onClose} heightMode="full">
      <Layout.FlexCol w="100%" p={16} gap={16}>
        <Typo type="title-large" color="BLACK">
          {t('title')}
        </Typo>

        {/* Public section */}
        <Layout.FlexCol w="100%" gap={8}>
          <Typo type="label-medium" color="MEDIUM_GRAY">
            {t('public_section')}
          </Typo>
          <S.Row onClick={handleSelectPublic}>
            <S.PublicAvatar>🌐</S.PublicAvatar>
            <Typo type="body-medium" color="BLACK">
              {t('public_label')}
            </Typo>
          </S.Row>
        </Layout.FlexCol>

        {/* Loading state */}
        {friends === null && (
          <Typo type="body-medium" color="MEDIUM_GRAY">
            {t('loading')}
          </Typo>
        )}

        {/* Close Friends section */}
        {closeFriends.length > 0 && (
          <Layout.FlexCol w="100%" gap={8}>
            <Typo type="label-medium" color="MEDIUM_GRAY">
              {t('close_friends_section')}
            </Typo>
            {closeFriends.map((f) => (
              <S.Row key={f.id} onClick={() => handleSelectFriend(f.username)}>
                <ProfileImage imageUrl={f.profile_image} username={f.username} size={32} />
                <Typo type="body-medium" color="BLACK">
                  {f.username}
                </Typo>
              </S.Row>
            ))}
          </Layout.FlexCol>
        )}

        {/* Regular Friends section */}
        {regularFriends.length > 0 && (
          <Layout.FlexCol w="100%" gap={8}>
            <Typo type="label-medium" color="MEDIUM_GRAY">
              {t('friends_section')}
            </Typo>
            {regularFriends.map((f) => (
              <S.Row key={f.id} onClick={() => handleSelectFriend(f.username)}>
                <ProfileImage imageUrl={f.profile_image} username={f.username} size={32} />
                <Typo type="body-medium" color="BLACK">
                  {f.username}
                </Typo>
              </S.Row>
            ))}
          </Layout.FlexCol>
        )}

        {/* Empty state when fetched but no friends */}
        {friends !== null && closeFriends.length === 0 && regularFriends.length === 0 && (
          <Typo type="body-medium" color="MEDIUM_GRAY">
            {t('empty_friends')}
          </Typo>
        )}
      </Layout.FlexCol>
    </BottomModal>
  );
}

export default ViewAsPicker;
