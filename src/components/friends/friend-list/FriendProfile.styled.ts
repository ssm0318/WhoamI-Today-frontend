import styled from 'styled-components';
import { Z_INDEX } from '@constants/layout';
import { Layout } from '@design-system';

export const StyledFriendListWrapper = styled.ul`
  display: flex;
  overflow-x: auto;
  align-items: stretch;
  gap: 20px;
  background: white;
  padding: 8px 20px;
  width: 100%;
  flex-shrink: 0;
  position: absolute;
  z-index: ${Z_INDEX.FRIEND_FEED_FRIEND_LIST};
`;

interface StyledFriendImageProfileProps {
  selected?: boolean;
  imageUrl?: string | null;
}

export const StyledFriendProfileImage = styled(Layout.LayoutBase)<StyledFriendImageProfileProps>`
  background-image: url(${(props) =>
    props.imageUrl ? props.imageUrl : '/icons/friend_profile.png'});
  ${(props) => (props.selected ? `border: 5px solid ${props.theme.CALENDAR_TODAY};` : '')}
  width: 66px;
  height: 66px;
  border-radius: 33px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  background-origin: border-box;
`;

export const StyledFriendProfile = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;
