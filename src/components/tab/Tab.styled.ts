import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { BOTTOM_TABBAR_HEIGHT, MAX_WINDOW_WIDTH } from '@constants/layout';

export const TabWrapper = styled.nav`
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  max-width: ${MAX_WINDOW_WIDTH}px;
  margin: 0 auto;
  background-color: white;
  height: ${BOTTOM_TABBAR_HEIGHT}px;
  border: 1px solid ${({ theme }) => theme.GRAY_10};
  border-radius: 14px 14px 0px 0px;
`;

export const TabItem = styled(NavLink)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
