import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const TabWrapper = styled.nav`
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
`;

export const TabItem = styled(Link)`
  width: 100%;
  height: 50px;
  text-decoration: none;
  color: black;
  border: 1px solid;
  text-align: center;
`;
