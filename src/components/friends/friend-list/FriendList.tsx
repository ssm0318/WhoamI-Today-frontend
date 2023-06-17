import { Font, SvgIcon } from '@design-system';
import { friendList } from '@mock/friends';
import { StyledFriendListWrapper, StyledFriendProfile } from './FriendProfile.styled';

function FriendList() {
  return (
    <StyledFriendListWrapper>
      {friendList.map(({ profile_image, username }) => (
        <StyledFriendProfile>
          {profile_image ? (
            <img src={profile_image} alt={`${username}_profile`} />
          ) : (
            <SvgIcon name="my_profile" size={66} />
          )}
          <Font.Body type="12_regular">{username}</Font.Body>
        </StyledFriendProfile>
      ))}
    </StyledFriendListWrapper>
  );
}

export default FriendList;
