import styled from 'styled-components';
import { CheckBox } from './CheckBox';

/**
 * 사각형 형태의 체크박스
 */
export const StyledRectCheckBox = styled.div`
  display: flex;
  align-items: center;

  input {
    display: block;
    appearance: none;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    border-radius: 0px;

    background-image: url('/icons/checkbox_rectangle_default.svg');

    &:checked {
      border-color: transparent;
      background-image: url('/icons/checkbox_rectangle_checked.svg');
    }
  }

  .display-label {
    margin-left: 10px;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 140%;
  }
`;

/**
 * 원 형태의 체크박스
 */
export const StyledCheckBox = styled(CheckBox)`
  input {
    display: block;
    appearance: none;
    width: 20px;
    height: 20px;

    background-image: url('/icons/checkbox_default.svg');
    background-repeat: no-repeat;
    background-position: center left;
    background-size: contain;

    &:checked {
      border-color: transparent;
      background-image: url('/icons/checkbox_checked.svg');
    }
  }

  input + label,
  input:checked + label,
  .display-label {
    display: none;
  }
`;
