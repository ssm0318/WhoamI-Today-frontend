import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import TitleHeader from '@components/title-header/TitleHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { CheckCircle, Font, Layout, SvgIcon } from '@design-system';
import { friendList } from '@mock/friends';
import { User } from '@models/user';
import { StyledList, StyledListSettingItem, StyledUserItem } from './FriendGroupList.styled';

interface CheckUser extends User {
  checked?: boolean;
}

export function Friend({ profile_image, username }: Pick<User, 'profile_image' | 'username'>) {
  return (
    <Layout.FlexRow>
      <ProfileImage imageUrl={profile_image} username={username} size={20} />
      <Font.Display type="14_regular" ml={16}>
        {username}
      </Font.Display>
    </Layout.FlexRow>
  );
}
export function FriendGroup() {
  const [t] = useTranslation('translation', { keyPrefix: 'friend_group' });

  const [checkFriends, setCheckFriends] = useState<CheckUser[]>(friendList);
  const [mode, setMode] = useState<'list' | 'edit'>('list');

  const resetCheckFriends = () => {
    const list = checkFriends.map((group) => ({ ...group, checked: false }));
    setCheckFriends(list);
  };

  const handleClickEdit = () => setMode('edit');
  const handleClickSave = () => {
    // TODO
    setMode('list');
    resetCheckFriends();
  };

  const navigate = useNavigate();
  const handleGoToUser = (username: string) => {
    navigate(`/users/${username}`);
  };

  const handleToggleFriend = (userId: number) => {
    const selectedFriendIndex = checkFriends.findIndex((user) => user.id === userId);
    if (selectedFriendIndex === -1) return;

    setCheckFriends((list) => [
      ...list.slice(0, selectedFriendIndex),
      { ...list[selectedFriendIndex], checked: !list[selectedFriendIndex].checked },
      ...list.slice(selectedFriendIndex + 1),
    ]);
  };

  const showDeleteMemberButton = !!checkFriends.find((user) => !!user.checked);

  return (
    <MainContainer>
      <TitleHeader
        // FIXME: GROUP NAME
        title={t('title')}
        RightComponent={
          mode === 'edit' ? (
            <button type="button" onClick={handleClickSave}>
              <Font.Display type="18_bold" color="PRIMARY">
                {t('save')}
              </Font.Display>
            </button>
          ) : (
            <button type="button" onClick={handleClickEdit}>
              <Font.Display type="18_bold" color="PRIMARY">
                {t('edit')}
              </Font.Display>
            </button>
          )
        }
      />
      <Layout.LayoutBase w="100%" pt={TITLE_HEADER_HEIGHT + 50} ph={24}>
        <StyledList>
          {mode === 'list' &&
            checkFriends.map(({ id, username, profile_image }) => (
              <StyledUserItem key={id} role="button" onClick={() => handleGoToUser(username)}>
                <Friend profile_image={profile_image} username={username} />
                <SvgIcon name="more_arrow" color="BASIC_BLACK" size={16} />
              </StyledUserItem>
            ))}
          {mode === 'edit' &&
            checkFriends.map(({ id, checked, username, profile_image }) => (
              <StyledUserItem key={id}>
                <Friend profile_image={profile_image} username={username} />
                <CheckCircle
                  name={username}
                  checked={!!checked}
                  onChange={() => handleToggleFriend(id)}
                  hideLabel
                />
              </StyledUserItem>
            ))}
          {mode === 'list' && (
            <StyledListSettingItem>
              <Layout.FlexRow>
                <SvgIcon name="check_circle_add" size={20} />
                <Font.Display type="14_semibold" color="PRIMARY" ml={12}>
                  {t('add_group_member')}
                </Font.Display>
              </Layout.FlexRow>
            </StyledListSettingItem>
          )}
          {mode === 'edit' && (
            <StyledListSettingItem disabled={!showDeleteMemberButton} textAlign="center">
              <Layout.FlexRow>
                <Font.Display type="14_semibold" ml={12}>
                  {t('delete_group_member')}
                </Font.Display>
              </Layout.FlexRow>
            </StyledListSettingItem>
          )}
        </StyledList>
      </Layout.LayoutBase>
    </MainContainer>
  );
}

export default FriendGroup;
