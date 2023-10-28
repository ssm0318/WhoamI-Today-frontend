import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { MAX_WINDOW_WIDTH, TOP_NAVIGATION_HEIGHT, Z_INDEX } from '@constants/layout';
import { Layout } from '@design-system';

export const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  display: flex;
  max-width: ${MAX_WINDOW_WIDTH}px;
  background-color: white;
  height: ${TOP_NAVIGATION_HEIGHT}px;
  padding: 16px 24px;
  width: 100%;
  border-bottom: 1.2px solid ${({ theme }) => theme.GRAY_2};
  z-index: ${Z_INDEX.TITLE_HEADER};
`;

export const Menu = styled.div`
  padding: 0 20px;
`;

export const Logo = styled.div`
  font-size: 30px;
  text-align: center;
  flex-grow: 1;
`;

export const Noti = styled(Link)`
  text-decoration: none;
  position: relative;
`;

export const RightIconArea = styled(Layout.FlexRow)`
  position: relative;
`;
