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
    background-color: ${({ theme }) => theme.BASIC_BLACK};
  }

  .display-label {
    margin-left: 14px;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 140%;
  }
`;

export const StyledCheckCircle = styled.div`
  display: flex;
  align-items: center;

  input {
    display: none;
  }

  input + label {
    display: inline-block;
    width: 21px;
    height: 20px;
    background: url('/icons/check_circle_unchecked.svg');
    position: relative;
    padding: 0 0 0 0px;
    flex-shrink: 0;
  }

  input:checked + label {
    display: inline-block;
    width: 21px;
    height: 20px;
    background: url('/icons/check_circle_checked.svg');
    position: relative;
    padding: 0 0 0 0px;
    flex-shrink: 0;
  }

  .display-label {
    margin-left: 12px;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
  }
`;
