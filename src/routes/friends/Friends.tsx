import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CommonError from '@components/_common/common-error/CommonError';
import { Loader } from '@components/_common/loader/Loader.styled';
import NoContents from '@components/_common/no-contents/NoContents';
import FriendProfile from '@components/_common/profile-image/FriendProfile';
import { StyledFriendListWrapper } from '@components/friends/friend-list/FriendProfile.styled';
import { Button } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { FetchState } from '@models/api/common';
import { FriendToday, GetFriendsTodayResponse } from '@models/api/friends';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { getFriendsToday } from '@utils/apis/friends';

function Friends() {
  const [t] = useTranslation('translation');
  const { isFriendListLoading, friendList, getFriendList } = useBoundStore(UserSelector);

  const [selectedFriend, setSelectedFriend] = useState<FriendToday>();
  const [friendsTodayResponse, setFriendTodayResponse] = useState<
    FetchState<GetFriendsTodayResponse>
  >({ state: 'loading' });

  const selectFriend = (friendToday: FriendToday) => {
    setSelectedFriend(friendToday);
    // TODO: scroll to top
    // TODO: 읽음 처리
  };

  useAsyncEffect(async () => {
    try {
      const { results } = await getFriendsToday();

      if (!results) {
        setFriendTodayResponse({ state: 'hasError' });
        return;
      }

      setFriendTodayResponse({ state: 'hasValue', data: results });
    } catch {
      setFriendTodayResponse({ state: 'hasError' });
    }
  }, []);

  useAsyncEffect(async () => {
    if (friendList) return;
    await getFriendList();
  }, []);

  const navigate = useNavigate();
  const handleClickEditFriends = () => {
    navigate('edit');
  };

  const isLoading = friendsTodayResponse.state === 'loading' || isFriendListLoading;
  if (isLoading) return <Loader />;

  const hasFriends = friendList && friendList.length > 0;
  if (!hasFriends) return <NoContents text={t('no_contents.friends')} />;
  if (hasFriends && friendsTodayResponse.state === 'hasError') return <CommonError />;

  const friendWithoutToday = friendList?.filter(
    (friend) =>
      !friendsTodayResponse.data?.find((friendWithToday) => friend.id === friendWithToday.id),
  );

  return (
    <>
      <Button.Tertiary
        status="normal"
        text={t('friends.edit_friends')}
        onClick={handleClickEditFriends}
      />
      <StyledFriendListWrapper>
        {friendsTodayResponse?.data?.map((friendToday) => {
          const { id, profile_image, username } = friendToday;
          return (
            <FriendProfile
              key={username}
              imageUrl={profile_image}
              selected={id === selectedFriend?.id}
              username={username}
              selectFriend={() => selectFriend(friendToday)}
            />
            // TODO: 파란점(읽음 표시)
          );
        })}
        {friendWithoutToday?.map((friend) => {
          const { id, profile_image, username } = friend;
          return (
            <FriendProfile
              key={username}
              imageUrl={profile_image}
              selected={id === selectedFriend?.id}
              username={username}
              selectFriend={() => selectFriend(friend)}
            />
          );
        })}
      </StyledFriendListWrapper>
    </>
  );
}

export default Friends;