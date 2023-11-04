import { TOP_NAVIGATION_HEIGHT } from '@constants/layout';
import { SvgIcon } from '@design-system';
import { IconNames } from 'src/design-system/SvgIcon/SvgIcon.types';

interface IconProps {
  name: IconNames;
  onClick?: () => void;
  size?: number;
}

function Icon({ name, onClick, size = TOP_NAVIGATION_HEIGHT }: IconProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: size,
        height: size,
      }}
    >
      <SvgIcon name={name} size={size} />
    </button>
  );
}

export default Icon;
