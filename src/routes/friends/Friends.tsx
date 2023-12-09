import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Collapse from '@components/_common/\bcollapse/Collapse';
import CommonError from '@components/_common/common-error/CommonError';
import { Divider } from '@components/_common/divider/Divider.styled';
import { Loader } from '@components/_common/loader/Loader.styled';
import NoContents from '@components/_common/no-contents/NoContents';
import UpdatedProfile from '@components/_common/profile-image/UpdatedProfile';
import { StyledFriendListWrapper } from '@components/friends/friend-list/FriendProfile.styled';
import { Button, Layout, SvgIcon } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';

function Friends() {
  const [t] = useTranslation('translation');
  const { friendList, getFriendList } = useBoundStore(UserSelector);

  useAsyncEffect(async () => {
    if (friendList.state === 'hasValue') return;
    await getFriendList();
  }, []);

  const navigate = useNavigate();
  const handleClickEditFriends = () => {
    navigate('edit');
  };

  if (friendList.state === 'loading') return <Loader />;
  if (friendList.state === 'hasError') return <CommonError />;
  if (!friendList.data.length) return <NoContents text={t('no_contents.friends')} />;

  return (
    <>
      <Layout.FlexRow w="100%" p={4} justifyContent="flex-end">
        <Button.Tertiary
          status="normal"
          text={t('friends.edit_friends')}
          onClick={handleClickEditFriends}
          icon={<SvgIcon name="edit_filled" size={16} />}
          iconPosition="left"
          fontType="body-medium"
        />
      </Layout.FlexRow>
      <Collapse
        title={t('friends.updated_profiles')}
        collapsedItem={
          <StyledFriendListWrapper>
            {friendList.data.map(({ username, profile_image }) => (
              <UpdatedProfile username={username} imageUrl={profile_image} />
            ))}
          </StyledFriendListWrapper>
        }
      />
      <Divider marginLeading={12} width={1} />
    </>
  );
}

export default Friends;
