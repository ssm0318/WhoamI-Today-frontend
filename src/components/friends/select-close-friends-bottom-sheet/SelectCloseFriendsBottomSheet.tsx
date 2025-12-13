import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import BottomModalActionButton from '@components/_common/bottom-modal/BottomModalActionButton';
import Divider from '@components/_common/divider/Divider';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { CheckBox, Layout, Typo } from '@design-system';
import useInfiniteFetchFriends from '@hooks/useInfiniteFetchFriends';
import { Connection } from '@models/api/friends';
import * as S from './SelectCloseFriendsBottomSheet.styled';

interface Props {
  visible: boolean;
  closeBottomSheet: () => void;
}

function SelectCloseFriendsBottomSheet({ visible, closeBottomSheet }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'friends.list.select_close_friends' });
  const { allFriends, isAllFriendsLoading } = useInfiniteFetchFriends();
  const [selectedFriendIds, setSelectedFriendIds] = useState<Set<number>>(new Set());

  // BottomSheet가 닫힐 때 선택 상태 초기화
  useEffect(() => {
    if (!visible) {
      setSelectedFriendIds(new Set());
    }
  }, [visible]);

  // 모든 친구 목록 가져오기 (close friend 포함)
  const availableFriends = useMemo(() => {
    if (!allFriends) return [];
    const allFriendsList = allFriends.flatMap(({ results }) => results || []);
    // 숨김 친구만 제외하고 모든 친구 표시
    return allFriendsList.filter((user) => !user.is_hidden);
  }, [allFriends]);

  // 이미 close friend인 친구들을 초기 선택 상태로 설정
  useEffect(() => {
    if (availableFriends.length > 0) {
      const closeFriendIds = new Set(
        availableFriends
          .filter((user) => user.connection_status === Connection.CLOSE_FRIEND)
          .map((user) => user.id),
      );
      setSelectedFriendIds(closeFriendIds);
    }
  }, [availableFriends]);

  // 새롭게 추가할 close friend가 있는지 확인 (이미 close friend가 아닌 친구가 선택되어 있는지)
  const hasNewCloseFriends = useMemo(() => {
    return Array.from(selectedFriendIds).some(
      (friendId) =>
        availableFriends.find((friend) => friend.id === friendId)?.connection_status !==
        Connection.CLOSE_FRIEND,
    );
  }, [selectedFriendIds, availableFriends]);

  const handleToggleFriend = (friendId: number) => {
    setSelectedFriendIds((prev) => {
      const next = new Set(prev);
      if (next.has(friendId)) {
        next.delete(friendId);
      } else {
        next.add(friendId);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    // TODO: 선택한 친구들을 close friend로 변경하는 로직 구현
    closeBottomSheet();
    setSelectedFriendIds(new Set());
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
                <React.Fragment key={friend.id}>
                  {index > 0 && <Divider width={1} />}
                  <Layout.FlexRow
                    w="100%"
                    ph={16}
                    pv={12}
                    gap={12}
                    alignItems="center"
                    onClick={() => handleToggleFriend(friend.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <CheckBox
                      checked={selectedFriendIds.has(friend.id)}
                      onChange={() => handleToggleFriend(friend.id)}
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
                </React.Fragment>
              ))}
            </Layout.FlexCol>
          )}
        </S.ScrollableContent>

        <Layout.Fixed b={0} w="100%" bgColor="WHITE">
          <S.ConfirmButtonContainer w="100%" pt={16} pb={20} ph={12}>
            <BottomModalActionButton
              status={hasNewCloseFriends ? 'normal' : 'disabled'}
              text={t('add_to_close_friends')}
              onClick={handleConfirm}
            />
          </S.ConfirmButtonContainer>
        </Layout.Fixed>
      </S.Container>
    </BottomModal>,
    document.getElementById('modal-container') || document.body,
  );
}

export default SelectCloseFriendsBottomSheet;
