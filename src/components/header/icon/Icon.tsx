import { TOP_NAVIGATION_HEIGHT } from '@constants/layout';
import { SvgIcon } from '@design-system';
import { SvgIconProps } from 'src/design-system/SvgIcon/SvgIcon';

interface IconProps extends Omit<SvgIconProps, 'size'> {
  onClick?: () => void;
  size?: number;
}

function Icon({ onClick, size = TOP_NAVIGATION_HEIGHT, ...iconProps }: IconProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: size,
        height: size,
      }}
    >
      <SvgIcon size={size} {...iconProps} />
    </button>
  );
}

export default Icon;
