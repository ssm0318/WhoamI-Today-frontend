import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { BOTTOM_TABBAR_HEIGHT } from '@constants/layout';

export const TabWrapper = styled.nav`
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  max-width: 500px;
  margin: 0 auto;
  background-color: white;
  height: ${BOTTOM_TABBAR_HEIGHT}px;
`;

export const TabItem = styled(Link)`
  width: 100%;
  height: 100%;
  text-decoration: none;
  color: black;
  border: 1px solid;
  text-align: center;
`;
