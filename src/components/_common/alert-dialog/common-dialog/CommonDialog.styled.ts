import styled from 'styled-components';
import AlertDialog from '../AlertDialog';

export const StyledCommonDialog = styled(AlertDialog)`
  .body {
    padding: 0px;
  }

  .text_area {
    border-bottom: 0.5px solid ${({ theme }) => theme.MEDIUM_GRAY};
  }

  button {
    padding: 11px 0px;
    flex: 1 0 0;

    & + button {
      border-left: 0.5px solid ${({ theme }) => theme.MEDIUM_GRAY};
    }
  }
`;
