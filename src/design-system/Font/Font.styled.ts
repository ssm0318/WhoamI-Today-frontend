import styled, { css } from 'styled-components';
import { getStyle, toMarginPaddingString } from '../layouts';
import { TextPropsBase, TypoPropBase } from './Font';
import { FontAttrs, FontSettings } from './Font.types';

const getTextDecoration = ({
  lineThrough,
  underline,
}: {
  lineThrough?: boolean;
  underline?: boolean;
}) => {
  let textDecoration = 'none';
  if (lineThrough) {
    textDecoration = 'line-through';
  } else if (underline) {
    textDecoration = 'underline';
  }

  return textDecoration;
};

/**
 * @deprecated use StyledFont
 */
export const Font = styled.span<FontSettings & TextPropsBase>`
  display: block;
  max-width: 100%;
  font-size: ${({ fontSize }) => fontSize}px;
  font-weight: ${({ fontWeight }) => fontWeight};
  line-height: ${({ fontSize, lineHeight }) => fontSize * lineHeight}px;
  color: ${({ color, theme }) => theme[color || 'BLACK']};
  text-align: ${({ textAlign = 'left' }) => textAlign};
  ${({ m, mh, mv, mt, mr, mb, ml }) =>
    getStyle('margin', toMarginPaddingString(m, mh, mv, mt, mr, mb, ml))}
  white-space: ${({ pre }) => (pre ? 'pre-wrap' : 'normal')};
  text-decoration: ${({ lineThrough, underline }) => getTextDecoration({ lineThrough, underline })};

  ${({ numberOfLines, fontSize, lineHeight }) =>
    !!numberOfLines &&
    css`
      text-overflow: ellipsis;
      -webkit-line-clamp: ${numberOfLines};
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      max-height: ${fontSize * lineHeight * numberOfLines}px;
    `}

  ${({ italic }) =>
    italic &&
    css`
      font-style: italic;
    `}
`;

export const StyledFont = styled.span<FontAttrs & TypoPropBase>`
  font-size: ${({ fontSize }) => fontSize}px;
  font-weight: ${({ fontWeight }) => fontWeight};
  line-height: ${({ lineHeight }) => (lineHeight ? `${lineHeight}px` : '140%')};
  color: ${({ color, theme }) => theme[color || 'BLACK']};
  text-align: ${({ textAlign = 'left' }) => textAlign};
  ${({ m, mh, mv, mt, mr, mb, ml }) =>
    getStyle('margin', toMarginPaddingString(m, mh, mv, mt, mr, mb, ml))}
  white-space: ${({ pre }) => (pre ? 'pre-wrap' : 'normal')};
  text-decoration: ${({ lineThrough, underline }) => getTextDecoration({ lineThrough, underline })};

  ${({ numberOfLines, fontSize, lineHeight = 1.4 }) =>
    !!numberOfLines &&
    css`
      text-overflow: ellipsis;
      -webkit-line-clamp: ${numberOfLines};
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      max-height: ${fontSize * lineHeight * numberOfLines}px;
    `}

  ${({ italic }) =>
    italic &&
    css`
      font-style: italic;
    `}

  ${({ ellipsis }) =>
    ellipsis?.enabled &&
    css`
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: ${ellipsis.maxWidth}px;
    `}
`;
