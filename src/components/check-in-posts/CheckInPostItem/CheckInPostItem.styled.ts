import styled from 'styled-components';
import { Colors } from '@design-system';

export const PostImage = styled.img`
  width: 100%;
  max-height: 360px;
  object-fit: cover;
  border-radius: 12px;
  background-color: ${Colors.LIGHT};
`;
