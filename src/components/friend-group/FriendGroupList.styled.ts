import styled from 'styled-components';

export const StyledGroupList = styled.ul`
  border-radius: 5.74px;
  border: 1px solid ${({ theme }) => theme.GRAY_2};
  width: 100%;

  li:last-child {
    border: none;
  }
`;

export const StyledGroup = styled.li`
  padding: 16px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.GRAY_2};
  display: flex;
  justify-content: space-between;
`;

export const StyledCheckBox = styled.div`
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
