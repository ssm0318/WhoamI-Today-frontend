import { useCallback, useState } from 'react';
import { buttonColorSettings } from './Button.constants';
import { ButtonProps } from './Button.types';

export const useButton = (props: ButtonProps) => {
  const { type, status, text, onClick: _onClick } = props;
  const colorSetting = buttonColorSettings[type];

  const [hovered, setHovered] = useState(false);
  const onMouseEnter = useCallback(() => status === 'normal' && setHovered(true), [status]);
  const onMouseLeave = useCallback(() => status === 'normal' && setHovered(false), [status]);

  const interactionDisabled = status === 'disabled' || status === 'completed';
  const onClick = useCallback(() => {
    if (interactionDisabled) return;
    _onClick?.();
  }, [interactionDisabled, _onClick]);

  const fill =
    !interactionDisabled && hovered
      ? colorSetting.hovered.background
      : colorSetting[status].background;
  const outline =
    !interactionDisabled && hovered ? colorSetting.hovered.outline : colorSetting[status].outline;
  const color =
    !interactionDisabled && hovered ? colorSetting.hovered.text : colorSetting[status].text;

  return {
    text,
    fill,
    outline,
    color,
    onMouseEnter,
    onMouseLeave,
    onTouchStart: onMouseEnter,
    onTouchEnd: onMouseLeave,
    onClick,
    status,
  };
};
