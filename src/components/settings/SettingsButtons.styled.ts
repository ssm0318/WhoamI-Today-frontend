import styled from 'styled-components';
import ExternalAnchor from '@components/_common/external-anchor/ExternalAnchor';
import { DEFAULT_MARGIN } from '@constants/layout';

export const StyledSettingsButton = styled.button`
  width: 100%;
  padding: 0 ${DEFAULT_MARGIN}px;
`;

export const StyledAccountSettingsButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export const StyledSettingsAnchor = styled(ExternalAnchor)`
  width: 100%;
  padding: 0 ${DEFAULT_MARGIN}px;
`;

export const StyledEditProfileButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
