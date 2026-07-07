import styled from 'styled-components';

export const PermissionTextContainer = styled.button<{
  cursor?: 'pointer' | 'default';
}>`
  width: 100%;
  cursor: ${({ cursor }) => cursor};
  display: flex;
  flex-direction: column;
`;

export const PreferenceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 6px;
  width: 100%;
`;

export const PreferenceRow = styled.div<{
  disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 56px;
  opacity: ${({ disabled }) => (disabled ? 0.55 : 1)};
`;

export const PreferenceCopy = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
`;

export const PreferenceDescription = styled.p`
  color: ${({ theme }) => theme.DARK_GRAY};
  font-size: 13px;
  line-height: 18px;
`;
