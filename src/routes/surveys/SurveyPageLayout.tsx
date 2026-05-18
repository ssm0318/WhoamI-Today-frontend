import styled from 'styled-components';
import { Colors, Layout } from '@design-system';

export const SurveyPageShell = styled(Layout.FlexCol)`
  width: 100%;
  min-height: 100%;
  padding: 16px 16px calc(32px + env(safe-area-inset-bottom, 0px));
  background: ${Colors.LIGHT};
`;
