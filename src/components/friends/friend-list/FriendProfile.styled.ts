import styled from 'styled-components';
import { Layout, Typo } from '@design-system';

export const StyledFriendListWrapper = styled.ul`
  display: flex;
  overflow-x: auto;
  align-items: stretch;
  gap: 9px;
  background: white;
  padding: 16px 16px 0px 16px;
  width: 100%;
  flex-shrink: 0;
`;

interface StyledFriendImageProfileProps {
  imageUrl?: string | null;
}

export const StyledUserProfile = styled(Layout.LayoutBase)<StyledFriendImageProfileProps>`
  background-image: url(${(props) =>
    props.imageUrl ? props.imageUrl : '/icons/friend_profile.png'});
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  background-origin: border-box;
`;

export const UpdatedProfileWrapper = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  width: 61px;
  position: relative;
`;

export const UpdatedChatNumber = styled(Typo)`
  position: absolute;
  top: -8px;
  right: -7px;
`;
