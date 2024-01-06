import styled, { css } from 'styled-components';
import { Layout } from '@design-system';

export const StyledTabs = styled(Layout.FlexRow)`
  border-radius: 6px;
  padding: 2px;
`;

interface StyledTabProps {
  w?: string | number;
}

export const StyledTab = styled.button.attrs({
  type: 'button',
})<StyledTabProps>`
  border-radius: 5px;
  padding: 10px 8px;

  ${({ w }) => css`
    ${Layout.getStyle('width', w)}
  `}

  &.active {
    box-shadow: 1px 0px 5px rgba(0, 0, 0, 0.1);
    background-color: ${({ theme }) => theme.WHITE};
  }
`;
