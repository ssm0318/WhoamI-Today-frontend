import styled from 'styled-components';
import ExternalAnchor from '@components/_common/external-anchor/ExternalAnchor';
import { DEFAULT_MARGIN } from '@constants/layout';

export const StyledSettingsButton = styled.button`
  width: 100%;
  padding: 0 ${DEFAULT_MARGIN}px;
`;

export const StyledAccountSettingsButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export const StyledSettingsAnchor = styled(ExternalAnchor)`
  width: 100%;
  padding: 0 ${DEFAULT_MARGIN}px;
`;

export const StyledToggleButton = styled.label`
  position: relative;
  display: inline-block;
  width: 51px;
  height: 27px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({ theme }) => theme.GRAY_1};
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 18px;
  }

  .slider:before {
    position: absolute;
    content: '';
    height: 20px;
    width: 20px;
    left: 4px;
    bottom: 4px;
    background-color: ${({ theme }) => theme.BASIC_WHITE};
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 18px;
  }

  input:checked + .slider {
    background-color: ${({ theme }) => theme.BASIC_BLACK};
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(22px);
    -ms-transform: translateX(22px);
    transform: translateX(22px);
  }
`;