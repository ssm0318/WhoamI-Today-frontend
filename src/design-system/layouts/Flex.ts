import styled, { css } from 'styled-components';
import { BgColor, Border, BoxStyle, Flex } from './layout.types';
import { getStyle, toMarginPaddingString } from './layout.utils';

/**
 * @prop {number | string} `rounded` border radius
 * @prop {number} `m`, `p` margin, padding
 * @prop {number} `mv`, `pv` vertical
 * @prop {number} `mh`, `ph` horizontal
 * @prop {number} `ml`, `mr`, `mt`, `mb`, `pt`, `pb`, `pl`, `pr` allowed
 * @prop {number | string} `w` width
 * @prop {number | string} `h` height
 * @prop {'flex-start' | 'flex-end' | 'center'} `alignItems` align-items
 * @prop {'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-evenly'} `justifyContent` justify content
 * @prop {ColorKeys} `bgColor` background color
 */
export const LayoutBase = styled.div<BgColor & Flex & BoxStyle & Border>`
  ${({
    theme,
    p,
    ph,
    pv,
    pt,
    pr,
    pb,
    pl,
    m,
    mh,
    mv,
    mt,
    mr,
    mb,
    ml,
    w,
    h,
    flex,
    rounded,
    z,
    outline,
    alignItems = 'flex-start',
    bgColor = 'TRANSPARENT',
    justifyContent = 'flex-start',
    cursor,
    gap = 0,
  }) => css`
    ${getStyle('padding', toMarginPaddingString(p, ph, pv, pt, pr, pb, pl))}
    ${getStyle('margin', toMarginPaddingString(m, mh, mv, mt, mr, mb, ml))}
    ${getStyle('width', w)}
    ${getStyle('height', h)}
    ${getStyle('flex', flex)}
    ${getStyle('border-radius', rounded)}
    ${getStyle('border-color', outline ? theme[outline] : undefined)}
    ${getStyle('z-index', z)}
    ${typeof rounded === 'number' ? 'overflow: hidden;' : ''}
    ${typeof outline === 'string' ? 'border-width: 1px; border-style: solid;' : ''}
    display: flex;
    flex-direction: column;
    align-items: ${alignItems};
    justify-content: ${justifyContent};
    background-color: ${theme[bgColor]};
    cursor: ${cursor};
    gap: ${gap}px;
  `}
`;

export const FlexRow = styled(LayoutBase)`
  flex-direction: row;
`;

export const FlexCol = styled(LayoutBase)`
  flex-direction: column;
`;
