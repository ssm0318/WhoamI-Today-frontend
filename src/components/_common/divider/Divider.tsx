import React from 'react';
import * as S from './Divider.styled';
import { DividerProps } from './Divider.types';

/**
 * Divider 컴포넌트
 *
 * @prop {boolean} horizontal - divider의 방향 `default: true`
 * @prop {number} width - divider의 두께
 * @prop {number} margin - divider의 앞/뒤 margin
 * @prop {number} marginLeading - divider의 앞 margin, margin 값이 있더라도 덮어씀
 * @prop {number} marginTrailing - divider의 뒤 margin, margin 값이 있더라도 덮어씀
 * @prop {ColorKeys} bgColor - bgColor
 */
const Divider = React.memo((props: DividerProps) => {
  return <S.Divider {...props} />;
});

export default Divider;
