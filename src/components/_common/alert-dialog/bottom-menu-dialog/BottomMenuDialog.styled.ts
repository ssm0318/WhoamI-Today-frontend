import styled from 'styled-components';
import AlertDialog from '../AlertDialog';

export const StyledBottomMenuDialog = styled(AlertDialog)`
  .body {
    width: 100%;
    bottom: 32px;
    padding: 8px;
    background-color: transparent;

    .menu-list {
      background-color: ${({ theme }) => theme.WHITE};

      button {
        width: 100%;
        padding: 18px 16px;

        & + button {
          border-top: 0.5px solid ${({ theme }) => theme.LIGHT_GRAY};
        }
      }
    }
  }
`;
