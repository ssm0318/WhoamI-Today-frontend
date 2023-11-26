import styled from 'styled-components';

interface Props {
  type: ToggleSwitchSize;
}

export type ToggleSwitchSize = 'large' | 'small';

const WIDTH = {
  large: 51,
  small: 41,
};

const HEIGHT = {
  large: 27,
  small: 20,
};

const CIRCLE_SIZE = {
  large: 20,
  small: 16,
};

const CIRCLE_POSITION = {
  large: 4,
  small: 2,
};

const TRANSLATE_X = {
  large: 22,
  small: 20,
};

export const StyledToggleButton = styled.label<Props>`
  position: relative;
  display: inline-block;
  width: ${({ type }) => `${WIDTH[type]}px`};
  height: ${({ type }) => `${HEIGHT[type]}px`};

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
    width: ${({ type }) => `${CIRCLE_SIZE[type]}px`};
    height: ${({ type }) => `${CIRCLE_SIZE[type]}px`};
    left: ${({ type }) => `${CIRCLE_POSITION[type]}px`};
    bottom: ${({ type }) => `${CIRCLE_POSITION[type]}px`};
    background-color: ${({ theme }) => theme.BASIC_WHITE};
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 18px;
  }

  input:checked + .slider {
    background-color: ${({ theme }) => theme.BASIC_BLACK};
  }

  input:checked + .slider:before {
    -webkit-transform: ${({ type }) => `translateX(${TRANSLATE_X[type]}px)`};
    -ms-transform: ${({ type }) => `translateX(${TRANSLATE_X[type]}px)`};
    transform: ${({ type }) => `translateX(${TRANSLATE_X[type]}px)`};
  }
`;
