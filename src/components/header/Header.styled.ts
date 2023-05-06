import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  display: flex;
  max-width: 500px;
  background-color: white;
  height: 50px;
  width: 100%;
  box-sizing: border-box;
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
  color: black;
  padding: 0 20px;
`;
