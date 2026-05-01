import { MouseEvent } from 'react';
import { TOP_NAVIGATION_HEIGHT } from '@constants/layout';
import { ColorKeys, SvgIcon } from '@design-system';
import { SvgIconProps } from 'src/design-system/SvgIcon/SvgIcon';
import { StyledIcon } from './Icon.styled';

interface IconProps extends Omit<SvgIconProps, 'size'> {
  onClick?: (e: MouseEvent) => void;
  onMouseDown?: (e: MouseEvent) => void;
  size?: number;
  background?: ColorKeys;
  disabled?: boolean;
  padding?: number;
}

function Icon({
  onClick,
  onMouseDown,
  size = TOP_NAVIGATION_HEIGHT,
  background,
  disabled = false,
  padding,
  ...iconProps
}: IconProps) {
  return (
    <StyledIcon
      type="button"
      onClick={onClick}
      onMouseDown={onMouseDown}
      size={padding ? size + 2 * padding : size}
      backgroundColor={background}
      disabled={disabled}
    >
      <SvgIcon size={size} {...iconProps} />
    </StyledIcon>
  );
}

export default Icon;
