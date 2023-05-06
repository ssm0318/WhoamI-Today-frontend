import { useCallback, useState } from 'react';
import { buttonColorSettings } from './Button.constants';
import { ButtonProps } from './Button.types';

export const useButton = (props: ButtonProps) => {
  const { type, status, text, onClick: _onClick } = props;
  const colorSetting = buttonColorSettings[type];

  const [pressed, setPressed] = useState(false);
  const onMouseEnter = useCallback(() => status === 'normal' && setPressed(true), [status]);
  const onMouseLeave = useCallback(() => status === 'normal' && setPressed(false), [status]);

  const onClick = useCallback(() => {
    if (status !== 'normal' && status !== 'pressed') return;
    _onClick?.();
  }, [status, _onClick]);

  const fill = pressed ? colorSetting.pressed.background : colorSetting[status].background;
  const outline = pressed ? colorSetting.pressed.outline : colorSetting[status].outline;
  const color = pressed ? colorSetting.pressed.text : colorSetting[status].text;

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
  };
};
