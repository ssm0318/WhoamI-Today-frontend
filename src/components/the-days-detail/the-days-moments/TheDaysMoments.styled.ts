import styled from 'styled-components';
import { Layout } from '@design-system';

export const PhotoWrapper = styled.div`
  position: relative;
`;

export const ContentWrapper = styled(Layout.FlexRow).attrs({
  w: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
})`
  span {
    padding: 6px 14px 6px 14px;
  }

  button {
    padding-right: 12px;
  }
`;

export const Photo = styled.img`
  width: 100%;
  object-fit: cover;
`;