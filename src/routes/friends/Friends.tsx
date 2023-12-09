import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CommonError from '@components/_common/common-error/CommonError';
import { Loader } from '@components/_common/loader/Loader.styled';
import NoContents from '@components/_common/no-contents/NoContents';
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
  );
}

export default Friends;
