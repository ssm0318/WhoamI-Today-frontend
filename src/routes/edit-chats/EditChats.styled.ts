import styled from 'styled-components';
import { BOTTOM_TABBAR_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import { MainWrapper } from '@styles/wrappers';

export const EditChatsScrollContainer = styled(MainWrapper)`
  margin-top: 10px;
  margin-bottom: 85px;
`;

export const StyledBottomArea = styled(Layout.Fixed)`
  box-shadow: 0px -4px 12px 0px rgba(0, 0, 0, 0.16);
  height: ${BOTTOM_TABBAR_HEIGHT}px;
`;

const StyledBottomButton = styled.button`
  display: flex;
  width: 175px;
  height: 55px;
  padding: 18px 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;

  border-radius: 13px;
  backdrop-filter: blur(40px);
`;

export const StyledMuteButton = styled(StyledBottomButton)`
  background: ${({ theme }) => theme.MEDIUM_GRAY};

  span {
    color: ${({ theme }) => theme.WHITE};
  }

  &:disabled {
    background: ${({ theme }) => theme.LIGHT};

    span {
      color: ${({ theme }) => theme.DARK_GRAY};
    }
  }
`;

export const StyledDeleteButton = styled(StyledBottomButton)`
  background: ${({ theme }) => theme.WARNING};

  span {
    color: ${({ theme }) => theme.WHITE};
  }

  &:disabled {
    background: ${({ theme }) => theme.LIGHT_GRAY};

    span {
      color: ${({ theme }) => theme.DARK_GRAY};
    }
  }
`;
