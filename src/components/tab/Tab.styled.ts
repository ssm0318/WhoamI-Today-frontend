import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { BOTTOM_TABBAR_HEIGHT, MAX_WINDOW_WIDTH, Z_INDEX } from '@constants/layout';
import { Layout } from '@design-system';

export const TabWrapper = styled.nav`
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  max-width: ${MAX_WINDOW_WIDTH}px;
  margin: 0 auto;
  background-color: white;
  height: ${BOTTOM_TABBAR_HEIGHT}px;
  padding: 8px 36px 29px 36px;
  box-shadow: 0px -4px 12px 0px rgba(0, 0, 0, 0.16);
  z-index: ${Z_INDEX.BOTTOM_TAB};
`;

export const NavTabItem = styled(NavLink)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.LIGHT_GRAY};
  }

  .active {
    border: 2px solid ${({ theme }) => theme.PRIMARY};
  }
`;

export const StyledTabItem = styled(Layout.FlexCol)`
  position: relative;
`;
