import React from 'react';
import { ColorKeys } from '@design-system';
import * as S from './Placeholder.styled';

interface PlaceholderProps {
  children: React.ReactNode;
  outline?: ColorKeys;
  bgColor?: ColorKeys;
  onClick?: () => void;
  gap?: number;
  ph?: number;
}

export function PlaceholderWrapper({
  children,
  outline = 'MEDIUM_GRAY',
  bgColor = 'LIGHT',
  onClick,
  gap = 4,
  ph = 20,
}: PlaceholderProps) {
  return (
    <S.PlaceholderWrapper
      outline={outline}
      bgColor={bgColor}
      pv={4}
      ph={ph}
      gap={gap}
      onClick={onClick}
      alignItems="center"
    >
      {children}
    </S.PlaceholderWrapper>
  );
}
