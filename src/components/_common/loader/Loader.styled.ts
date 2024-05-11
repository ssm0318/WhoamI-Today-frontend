import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Loading = keyframes`
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }`;

export const Loader = styled.div`
  border-radius: 50%;
  width: 48px;
  height: 48px;
  margin: 60px auto;
  font-size: 8px;
  position: relative;
  text-indent: -9999em;
  border-top: 8px solid rgba(0, 0, 0, 0.2);
  border-right: 8px solid rgba(0, 0, 0, 0.2);
  border-bottom: 8px solid rgba(0, 0, 0, 0.2);
  border-left: 8px solid #ffffff;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: ${Loading} 1.1s infinite linear;
  animation: ${Loading} 1.1s infinite linear;
  flex-shrink: 0;
  &:after {
    border-radius: 50%;
    width: 48px;
    height: 48px;
  }
`;
