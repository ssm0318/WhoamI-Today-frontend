import styled from 'styled-components';

export const StyledCheckBox = styled.div`
  display: flex;
  align-items: center;

  input {
    display: none;
  }

  input + label {
    display: inline-block;
    width: 24px;
    height: 24px;
    border: 2px solid ${({ theme }) => theme.GRAY_2};
    position: relative;
    flex-shrink: 0;
  }

  input:checked + label {
    border: 2px solid ${({ theme }) => theme.GRAY_8};
    background-color: ${({ theme }) => theme.BLACK};
  }

  .display-label {
    margin-left: 14px;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 140%;
  }
`;
