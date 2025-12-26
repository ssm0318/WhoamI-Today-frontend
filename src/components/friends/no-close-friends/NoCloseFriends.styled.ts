import styled from 'styled-components';
import { Layout, Typo } from '@design-system';

export const Container = styled(Layout.FlexCol)`
  width: 100%;
`;

export const EmojiContainer = styled.div`
  font-size: 32px;
  line-height: 1;
`;

export const DescriptionText = styled(Typo)`
  text-align: center;
`;
