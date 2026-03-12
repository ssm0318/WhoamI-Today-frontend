import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import BottomModalActionButton from '@components/_common/bottom-modal/BottomModalActionButton';
import Divider from '@components/_common/divider/Divider';
import * as ModalS from '@components/_common/friend-type-select-modal/FriendTypeSelectModal.styled';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { CheckBox, Layout, Typo } from '@design-system';
import useInfiniteFetchFriends from '@hooks/useInfiniteFetchFriends';
import { Connection } from '@models/api/friends';
import { useBoundStore } from '@stores/useBoundStore';
import { changeConnection } from '@utils/apis/friends';
import * as S from './SelectCloseFriendsBottomSheet.styled';

interface Props {
  visible: boolean;
  closeBottomSheet: () => void;
  onFriendAdded?: () => void;
}

function SelectCloseFriendsBottomSheet({ visible, closeBottomSheet, onFriendAdded }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'friends.list.select_close_friends' });
  const [tDialog] = useTranslation('translation', {
    keyPrefix: 'friends.explore_friends.friend_item.friend_type_select_dialog',
  });
  const { allFriends, isAllFriendsLoading } = useInfiniteFetchFriends({ type: 'all' });
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isUpdatePastPosts, setIsUpdatePastPosts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));

  // Reset state when bottom sheet closes
  useEffect(() => {
    if (!visible) {
      setSelectedFriendId(null);
      setShowConfirmDialog(false);
      setIsUpdatePastPosts(false);
    }
  }, [visible]);

  // Get friends who are NOT already close friends
  const availableFriends = useMemo(() => {
    if (!allFriends) return [];
    return allFriends
      .flatMap(({ results }) => results || [])
      .filter((user) => !user.is_hidden && user.connection_status !== Connection.CLOSE_FRIEND);
  }, [allFriends]);

  const handleSelectFriend = (friendId: number) => {
    setSelectedFriendId(friendId);
  };

  const handleClickAdd = () => {
    if (!selectedFriendId) return;
    setShowConfirmDialog(true);
  };

  const handleCancelConfirm = () => {
    setShowConfirmDialog(false);
    setIsUpdatePastPosts(false);
  };

  const handleConfirm = () => {
    if (!selectedFriendId || isSubmitting) return;

    setIsSubmitting(true);
    changeConnection(selectedFriendId, {
      choice: Connection.CLOSE_FRIEND,
      update_past_posts: isUpdatePastPosts,
    })
      .then(() => {
        setShowConfirmDialog(false);
        closeBottomSheet();
        onFriendAdded?.();
        openToast({ message: t('success') });
      })
      .catch(() => {
        setShowConfirmDialog(false);
        closeBottomSheet();
        openToast({ message: t('error') });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return createPortal(
    <BottomModal visible={visible} onClose={closeBottomSheet} heightMode="full">
      <S.Container>
        <Icon name="home_indicator" />
        <Layout.FlexCol w="100%" ph={16} pv={20}>
          <Typo type="title-large">{t('title')}</Typo>
        </Layout.FlexCol>

        <S.ScrollableContent>
          {isAllFriendsLoading ? (
            <Layout.FlexCol alignItems="center" justifyContent="center" pv={40}>
              <Typo type="body-medium" color="MEDIUM_GRAY">
                Loading...
              </Typo>
            </Layout.FlexCol>
          ) : availableFriends.length === 0 ? (
            <Layout.FlexCol alignItems="center" justifyContent="center" pv={40}>
              <Typo type="body-medium" color="MEDIUM_GRAY">
                {t('no_friends_available')}
              </Typo>
            </Layout.FlexCol>
          ) : (
            <Layout.FlexCol w="100%" gap={0}>
              {availableFriends.map((friend, index) => (
                <Layout.FlexCol key={friend.id} w="100%">
                  {index > 0 && <Divider width={1} />}
                  <Layout.FlexRow
                    w="100%"
                    ph={16}
                    pv={12}
                    gap={12}
                    alignItems="center"
                    onClick={() => handleSelectFriend(friend.id)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: selectedFriendId === friend.id ? '#F5F0FA' : 'transparent',
                    }}
                  >
                    <input
                      type="radio"
                      name="select-close-friend"
                      checked={selectedFriendId === friend.id}
                      onChange={() => handleSelectFriend(friend.id)}
                      style={{ accentColor: '#8700FF', width: 18, height: 18 }}
                    />
                    <ProfileImage
                      imageUrl={friend.profile_image}
                      username={friend.username}
                      size={40}
                    />
                    <Layout.FlexCol flex={1}>
                      <Typo type="label-large" color="BLACK">
                        {friend.username}
                      </Typo>
                    </Layout.FlexCol>
                  </Layout.FlexRow>
                </Layout.FlexCol>
              ))}
            </Layout.FlexCol>
          )}
        </S.ScrollableContent>

        <Layout.Fixed b={0} w="100%" bgColor="WHITE">
          <S.ConfirmButtonContainer w="100%" pt={16} pb={20} ph={12}>
            <BottomModalActionButton
              status={selectedFriendId && !isSubmitting ? 'normal' : 'disabled'}
              text={t('add_to_close_friends')}
              onClick={handleClickAdd}
            />
          </S.ConfirmButtonContainer>
        </Layout.Fixed>
      </S.Container>

      {/* Confirmation dialog for "apply to past posts" */}
      {showConfirmDialog && (
        <ModalS.Container>
          <ModalS.Background onClick={handleCancelConfirm} />
          <ModalS.Body onClick={(e) => e.stopPropagation()}>
            <Layout.FlexCol w="100%" alignItems="center" p={16}>
              <Typo type="title-large" mb={5}>
                {t('add_to_close_friends')}
              </Typo>
              <Layout.FlexRow mt={10} ml={20}>
                <CheckBox
                  name={tDialog('update_past_posts') || ''}
                  onChange={() => setIsUpdatePastPosts((prev) => !prev)}
                  checked={isUpdatePastPosts}
                />
              </Layout.FlexRow>
            </Layout.FlexCol>
            <ModalS.ButtonContainer w="100%" justifyContent="space-evenly">
              <ModalS.Button onClick={handleCancelConfirm} pv={11}>
                <Typo type="button-medium">{tDialog('cancel')}</Typo>
              </ModalS.Button>
              <ModalS.Button onClick={handleConfirm} pv={11} hasBorderRight={false}>
                <Typo type="button-medium" color="PRIMARY">
                  {tDialog('confirm')}
                </Typo>
              </ModalS.Button>
            </ModalS.ButtonContainer>
          </ModalS.Body>
        </ModalS.Container>
      )}
    </BottomModal>,
    document.getElementById('modal-container') || document.body,
  );
}

export default SelectCloseFriendsBottomSheet;
