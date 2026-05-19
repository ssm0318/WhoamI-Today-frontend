import styled from 'styled-components';
import { Colors, Layout } from '@design-system';

export const SurveyPageShell = styled(Layout.FlexCol)`
  width: 100%;
  flex: 0 0 auto;
  min-height: 100%;
  padding: 20px 20px calc(96px + env(safe-area-inset-bottom, 0px));
  background: ${Colors.LIGHT};

  @media (max-width: 360px) {
    padding: 16px 16px calc(88px + env(safe-area-inset-bottom, 0px));
  }
`;
