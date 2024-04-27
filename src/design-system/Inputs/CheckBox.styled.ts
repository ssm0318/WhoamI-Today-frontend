import styled from 'styled-components';

export const StyledCheckBox = styled.div`
  display: flex;
  align-items: center;

  input {
    display: block;
    appearance: none;
    width: 20px;
    height: 20px;

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
