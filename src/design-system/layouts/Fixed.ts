import styled, { css } from 'styled-components';
import { Layout } from '@design-system';
import { LayoutBase } from './Flex';
import { Translate } from './layout.types';
import { toTranslateString } from './layout.utils';

type FixedStyle = {
  b?: number | string;
  t?: number | string;
  l?: number | string;
  r?: number | string;
  tl?: Translate;
};

export const Fixed = styled(LayoutBase)<FixedStyle>`
  position: fixed;
  ${({ b, t, l, r, tl }) => css`
    ${Layout.getStyle('bottom', b)}
    ${Layout.getStyle('top', t)}
    ${Layout.getStyle('left', l)}
    ${Layout.getStyle('right', r)}
    ${toTranslateString(tl)}
  `}
`;
