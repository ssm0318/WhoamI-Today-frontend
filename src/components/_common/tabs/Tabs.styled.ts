import styled, { css } from 'styled-components';
import { Layout } from '@design-system';
import { getStyle } from 'src/design-system/layouts';

export const StyledTabs = styled(Layout.FlexRow)`
  box-shadow: 1px 0px 5px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 1px;
`;

interface StyledTabProps {
  w?: string | number;
}

export const StyledTab = styled.button.attrs({
  type: 'button',
})<StyledTabProps>`
  border-radius: 5px;
  margin: 1px;
  padding: 4px 8px;

  ${({ w }) => css`
    ${getStyle('width', w)}
  `}

  &.active {
    box-shadow: 1px 0px 5px rgba(0, 0, 0, 0.1);
    background-color: ${({ theme }) => theme.BASIC_WHITE};
  }
`;
