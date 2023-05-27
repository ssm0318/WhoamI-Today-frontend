import React from 'react';
import { ReactSVG } from 'react-svg';
import { ColorKeys, Colors } from '@design-system';
import * as icons from './icons';
import { IconNames } from './SvgIcon.types';

/**
 * [Foundation] Svg Icons
 * @props `name` icon name **(required)**
 * @props `color` "color_*" icons only (default: BASIC_BLACK)
 * @props `size` for same width & height icons **(required)**
 * @props `width` icon width **(required)**
 * @props `height` icon height **(required)**
 *
 * @description Check icon Names types.
 *
 */

const SvgIcon = React.memo((props: SvgIconProps) => {
  const { name, color = 'BASIC_BLACK', width, height, size } = props;
  const iconName = allIconNames[name];

  const w = size || width;
  const h = size || height;

  if (!w || !h) {
    throw Error('size or width & height is necessary props');
  }
  return (
    <ReactSVG
      src={`/icons/${iconName}.svg`}
      beforeInjection={(svg: SVGSVGElement) => {
        if (!svg) return;
        svg.setAttribute('width', w.toString());
        svg.setAttribute('height', h.toString());
        svg.setAttribute('color', Colors[color]);
        svg.setAttribute('stroke', Colors[color]);
      }}
    />
  );
});

type SvgIconProps = {
  width?: number;
  height?: number;
  size: number;
  color?: ColorKeys;
  name: IconNames;
};

const allIconNames = {
  ...(icons || {}),
};

export default React.memo(SvgIcon);
