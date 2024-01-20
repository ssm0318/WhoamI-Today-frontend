import { MouseEvent } from 'react';
import { TOP_NAVIGATION_HEIGHT } from '@constants/layout';
import { ColorKeys, SvgIcon } from '@design-system';
import { SvgIconProps } from 'src/design-system/SvgIcon/SvgIcon';
import { StyledIcon } from './Icon.styled';

interface IconProps extends Omit<SvgIconProps, 'size'> {
  onClick?: (e: MouseEvent) => void;
  size?: number;
  background?: ColorKeys;
}

function Icon({ onClick, size = TOP_NAVIGATION_HEIGHT, background, ...iconProps }: IconProps) {
  return (
    <StyledIcon type="button" onClick={onClick} size={size} backgroundColor={background}>
      <SvgIcon size={size} {...iconProps} />
    </StyledIcon>
  );
}

export default Icon;
