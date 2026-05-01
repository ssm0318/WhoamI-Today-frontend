import styled from 'styled-components';
import { Layout } from '@design-system';

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  overflow-y: hidden;
  overscroll-behavior-y: none;
`;

export const Background = styled(Layout.Absolute)`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.DIM};
`;

export const Body = styled(Layout.Absolute)`
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  left: 50%;
  border-radius: 12.195px;
  background-color: ${({ theme }) => theme.WHITE};
  width: 80%;
  max-width: calc(100% - 40px);
  max-height: 80vh;
  overflow-y: auto;
`;

export const ButtonContainer = styled(Layout.FlexRow)`
  border-top: 1px solid ${({ theme }) => theme.MEDIUM_GRAY};
  width: 100%;
`;

export const Button = styled(Layout.FlexRow)<{
  hasBorderRight?: boolean;
}>`
  border-right: ${({ hasBorderRight = true, theme }) =>
    hasBorderRight && `1px solid ${theme.MEDIUM_GRAY}`};
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const SectionTitle = styled(Layout.FlexRow)`
  width: 100%;
  margin-top: 12px;
  margin-bottom: 6px;
`;

export const OtherInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  margin-top: 6px;
  border: 1px solid ${({ theme }) => theme.MEDIUM_GRAY};
  border-radius: 8px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.PRIMARY};
  }
`;

export const ClosenessRow = styled(Layout.FlexRow)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

export const ClosenessButton = styled.button<{ selected?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid ${({ selected, theme }) => (selected ? theme.PRIMARY : theme.MEDIUM_GRAY)};
  background-color: ${({ selected, theme }) => (selected ? theme.PRIMARY : 'transparent')};
  color: ${({ selected, theme }) => (selected ? theme.WHITE : theme.BLACK)};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ClosenessOption = styled(Layout.FlexCol)`
  align-items: center;
  flex: 1;
  gap: 4px;
  min-width: 0;
`;

export const RequiredNotice = styled(Layout.FlexRow)`
  width: 100%;
  padding: 0 16px 12px;
  justify-content: center;
`;

export const ConfirmSummary = styled(Layout.FlexCol)`
  width: 100%;
  padding: 16px;
  margin-top: 12px;
  background-color: ${({ theme }) => theme.LIGHT_GRAY};
  border-radius: 12px;
  gap: 12px;
`;

export const ConfirmItem = styled(Layout.FlexCol)`
  gap: 4px;
`;

export const ConfirmDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.MEDIUM_GRAY};
  opacity: 0.5;
`;
