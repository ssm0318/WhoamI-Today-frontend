import styled, { css } from 'styled-components';

import { Colors } from '@design-system';

export const Chip = styled.button<{ selected: boolean }>`
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 14px;
  border: 1px solid ${Colors.LIGHT_GRAY};
  background: ${Colors.WHITE};
  color: ${Colors.BLACK};
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  ${({ selected }) =>
    selected &&
    css`
      color: ${Colors.PRIMARY};
      background: #f3e8ff;
      border-color: ${Colors.PRIMARY};
    `}
`;
