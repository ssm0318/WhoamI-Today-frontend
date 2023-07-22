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
import { getFriendsToday } from '@utils/apis/friends';

function Friends() {
  const [selectedFriend, setSelectedFriend] = useState<FriendToday>();
  const [friendsTodayResponse, setFriendTodayResponse] = useState<
    FetchState<GetFriendsTodayResponse>
  >({ state: 'loading' });

  const selectFriend = (friendToday: FriendToday) => {
    setSelectedFriend(friendToday);
    // TODO: scroll to top
  };

  useAsyncEffect(async () => {
    try {
      const res = await getFriendsToday();
      setFriendTodayResponse({ state: 'hasValue', data: res });
    } catch {
      setFriendTodayResponse({ state: 'hasError' });
    }
  }, []);

  if (friendsTodayResponse.state === 'loading') return <Loader />;
  if (friendsTodayResponse.state === 'hasError') return <div>TODO: error</div>;

  return (
    <>
      <StyledFriendListWrapper>
        {/* TODO: 게시글이 없는 친구도 표시 */}
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
              <Font.Body type="12_regular">{username}</Font.Body>
            </StyledFriendProfile>
          );
        })}
      </StyledFriendListWrapper>
      {selectedFriend && (
        <TheDaysDetail
          moment={selectedFriend?.moment}
          questions={selectedFriend?.questions}
          mt={111}
        />
      )}
    </>
  );
}

export default Friends;
