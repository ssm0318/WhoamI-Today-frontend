import { Dispatch, SetStateAction } from 'react';
import UserProfile from '@components/_common/user-profile/UserProfile';
import { Font } from '@design-system';
import { friendList } from '@mock/friends';
import { User } from '@models/user';
import { StyledFriendListWrapper, StyledFriendProfile } from './FriendProfile.styled';

interface FriendListProps {
  selectedFriend?: User;
  selectFriend: Dispatch<SetStateAction<User | undefined>>;
}
function FriendList({ selectedFriend, selectFriend }: FriendListProps) {
  return (
    <StyledFriendListWrapper>
      {friendList.map((user) => {
        const { id, profile_image, username } = user;
        return (
          <StyledFriendProfile onClick={() => selectFriend(user)}>
            <UserProfile
              imageUrl={profile_image}
              username={username}
              size={66}
              className={selectedFriend?.id === id ? 'selected' : ''}
            />
            <Font.Body type="12_regular">{username}</Font.Body>
          </StyledFriendProfile>
        );
      })}
    </StyledFriendListWrapper>
  );
}

export default FriendList;
