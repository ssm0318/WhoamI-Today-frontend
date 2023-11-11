import styled, { css } from 'styled-components';
import { getStyle, Margin, toMarginPaddingString } from 'src/design-system/layouts';

export const StyledList = styled.ul`
  width: 100%;
  margin-bottom: 24px;

  li:first-child {
    border-radius: 5.74px 5.74px 0 0;
    border-top: 1px solid ${({ theme }) => theme.GRAY_2};
  }

  li:last-child {
    border-radius: 0 0 5.74px 5.74px;
  }
`;

export const StyledCommonListItem = styled.li`
  padding: 0px 16px;
  width: 100%;
  border-left: 1px solid ${({ theme }) => theme.GRAY_2};
  border-right: 1px solid ${({ theme }) => theme.GRAY_2};
  border-bottom: 1px solid ${({ theme }) => theme.GRAY_2};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StyledGroupItem = styled.div<Margin>`
  ${({ m, mh, mv, mt, mr, mb, ml }) => css`
    ${getStyle('margin', toMarginPaddingString(m, mh, mv, mt, mr, mb, ml))}
    padding: 7px 0 11px 0;
    display: flex;
    flex-direction: column;
  `}
`;

export const StyledUserItem = styled(StyledCommonListItem)`
  padding-top: 12px;
  padding-bottom: 13px;
`;

interface StyledListSettingItemProps {
  disabled?: boolean;
  textAlign?: 'left' | 'center';
}
export const StyledListSettingItem = styled(StyledCommonListItem)<StyledListSettingItemProps>`
  span {
    color: ${({ disabled, theme }) => (disabled === undefined ? theme.PRIMARY : theme.BASIC_WHITE)};
    text-align: ${({ textAlign = 'left' }) => textAlign};
  }
  background-color: ${({ disabled, theme }) =>
    disabled === undefined ? theme.BASIC_WHITE : disabled ? theme.GRAY_2 : theme.WARNING};
  padding: 15px;
  ${({ disabled }) => disabled !== undefined && 'border: none'};
  border-radius: 0 0 5.74px 5.74px;
  ${({ textAlign }) => textAlign === 'center' && 'justify-content: center'}
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
