import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const HeaderWrapper = styled.header`
  width: 100%;
  height: 50px;
  border: 1px solid;
  display: fixed;
  padding: 10px 0;
`;

export const Menu = styled.div`
  padding: 0 20px;
`;

export const Logo = styled.div`
  font-size: 50px;
  font-weight: 500px;
  text-align: center;
  flex-grow: 1;
`;

export const Noti = styled(Link)`
  text-decoration: none;
  color: black;
  padding: 0 20px;
`;
