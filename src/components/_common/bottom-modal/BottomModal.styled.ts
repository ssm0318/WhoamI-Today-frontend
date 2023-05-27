import styled from 'styled-components';
import { Layout } from '@design-system';

export const Background = styled(Layout.Absolute)<{
  backgroundColor: string;
}>`
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => props.backgroundColor};
  overflow: hidden;
  overscroll-behavior-y: none;
`;

export const Container = styled(Layout.Absolute)<{
  visible: boolean;
  height: number;
}>`
  box-shadow: 0px -4px 44px rgba(0, 0, 0, 0.12);
  border-radius: 17px 17px 0px 0px;
  width: 100%;
  height: ${(props) => props.height}px;
  bottom: ${(props) => -1 * props.height}px;
  transform: translateY(${(props) => (props.visible ? -props.height : 0)}px);
  transition: transform 0.3s ease-in;
  overflow: hidden;
  left: 0;
  position: fixed;
`;

export const Body = styled(Layout.LayoutBase)`
  overflow: auto;
  width: 100%;
  height: 100%;
`;
