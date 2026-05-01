import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useSWRConfig } from 'swr';
import { Loader } from '@components/_common/loader/Loader.styled';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import SubHeader from '@components/sub-header/SubHeader';
import { BOTTOM_TABBAR_HEIGHT } from '@constants/layout';
import { Layout, SvgIcon, Typo } from '@design-system';
import useInfiniteFetchFriends from '@hooks/useInfiniteFetchFriends';
import { UpdatedProfile } from '@models/api/friends';
import { useBoundStore } from '@stores/useBoundStore';
import { unHideFriend } from '@utils/apis/friends';
import { MainScrollContainer } from 'src/routes/Root';

function HiddenFriends() {
  const [t] = useTranslation('translation');
  const { mutate: globalMutate } = useSWRConfig();
  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));

  const {
    allFriends,
    isAllFriendsLoading,
    isLoadingMoreAllFriends,
    targetRef,
    refetchAllFriends,
    updateFriendList,
  } = useInfiniteFetchFriends({ type: 'hidden' });

  const hiddenList: UpdatedProfile[] = (allFriends ?? []).flatMap((page) => page.results ?? []);

  const handleUnhide = async (user: UpdatedProfile) => {
    updateFriendList({ type: 'break_friends', item: user });
    try {
      await unHideFriend(user.id);
      globalMutate(
        (key: string) => typeof key === 'string' && key.startsWith('/user/friends/?type='),
        undefined,
        { revalidate: true },
      );
      openToast({ message: t('friend.toast_unhidden') });
    } catch {
      refetchAllFriends();
    }
  };

  return (
    <MainScrollContainer>
      <SubHeader title={t('friend.hidden_friends_title')} />
      <Layout.FlexCol w="100%" pv={12} mb={BOTTOM_TABBAR_HEIGHT + 10}>
        {isAllFriendsLoading && <Loader />}
        {!isAllFriendsLoading && hiddenList.length === 0 && (
          <Layout.FlexRow w="100%" justifyContent="center" pv={20}>
            <Typo type="title-small" color="MEDIUM_GRAY">
              {t('friend.hidden_friends_empty')}
            </Typo>
          </Layout.FlexRow>
        )}
        {hiddenList.map((user) => (
          <Row key={user.id}>
            <Layout.FlexRow gap={8} alignItems="center" style={{ flex: 1, minWidth: 0 }}>
              <ProfileImage imageUrl={user.profile_image} username={user.username} size={44} />
              <Typo type="title-small" ellipsis={{ enabled: true, maxWidth: 150 }}>
                {user.username}
              </Typo>
              <SvgIcon name="view_alt" size={14} color="BLACK" />
            </Layout.FlexRow>
            <UnhideButton type="button" onClick={() => handleUnhide(user)}>
              <Typo type="label-large" color="PRIMARY" fontWeight={600}>
                {t('friend.unhide')}
              </Typo>
            </UnhideButton>
          </Row>
        ))}
        <div ref={targetRef} />
        {isLoadingMoreAllFriends && <Loader />}
      </Layout.FlexCol>
    </MainScrollContainer>
  );
}

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 16px;
  gap: 8px;
`;

const UnhideButton = styled.button`
  background: none;
  border: none;
  padding: 6px 10px;
  cursor: pointer;
`;

export default HiddenFriends;
