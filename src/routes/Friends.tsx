import { useState } from 'react';
import { Loader } from '@components/_common/loader/Loader.styled';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import {
  StyledFriendListWrapper,
  StyledFriendProfile,
} from '@components/friends/friend-list/FriendProfile.styled';
import TheDaysDetail from '@components/the-days-detail/TheDaysDetail';
import { Font } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { FetchState } from '@models/api/common';
import { FriendToday, GetFriendsTodayResponse } from '@models/api/friends';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { getFriendsToday } from '@utils/apis/friends';

function Friends() {
  const { friendList, getFriendList } = useBoundStore(UserSelector);

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
      const res = await getFriendsToday();
      setFriendTodayResponse({ state: 'hasValue', data: res });
    } catch {
      setFriendTodayResponse({ state: 'hasError' });
    }
  }, []);

  useAsyncEffect(async () => {
    if (friendList) return;
    await getFriendList();
  }, []);

  if (friendsTodayResponse.state === 'loading') return <Loader />;
  if (friendsTodayResponse.state === 'hasError') return <div>TODO: error</div>;

  const friendWithoutToday = friendList?.filter(
    (friend) =>
      !friendsTodayResponse.data?.find((friendWithToday) => friend.id === friendWithToday.id),
  );
  return (
    <>
      <StyledFriendListWrapper>
        {friendsTodayResponse.data.map((friendToday) => {
          const { id, profile_image, username } = friendToday;
          return (
            <StyledFriendProfile key={id} onClick={() => selectFriend(friendToday)}>
              <ProfileImage
                imageUrl={profile_image}
                username={username}
                size={66}
                className={id === selectedFriend?.id ? 'selected' : ''}
              />
              {/* TODO: 파란점(읽음 표시) */}
              <Font.Body type="12_regular">{username}</Font.Body>
            </StyledFriendProfile>
          );
        })}
        {friendWithoutToday?.map((friend) => {
          const { id, profile_image, username } = friend;
          return (
            <StyledFriendProfile key={id} onClick={() => selectFriend(friend)}>
              <ProfileImage
                imageUrl={profile_image}
                username={username}
                size={66}
                className={id === selectedFriend?.id ? 'selected' : ''}
              />
              <Font.Body type="12_regular">{username}</Font.Body>
            </StyledFriendProfile>
          );
        })}
      </StyledFriendListWrapper>
      {selectedFriend && (
        <TheDaysDetail
          moment={selectedFriend?.moment}
          questions={selectedFriend?.questions}
          mt={120}
        />
      )}
    </>
  );
}

export default Friends;
