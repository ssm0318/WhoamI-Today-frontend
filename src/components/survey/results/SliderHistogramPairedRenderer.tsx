import styled from 'styled-components';

import { Colors, Layout } from '@design-system';
import { SliderHistogramPairedDistribution } from '@models/survey';

// 2D circumplex for paired slider questions (e.g. mood valence × arousal).
// Each (x, y) pair is a small dot; the viewer's own pair is highlighted in
// PRIMARY purple. SVG was chosen over canvas so the chart remains crisp at
// any responsive width and stays accessible to screen readers.

const Frame = styled.svg`
  width: 100%;
  height: 240px;
  background: ${Colors.LIGHT};
  border-radius: 12px;
`;

const Axis = styled.line`
  stroke: ${Colors.LIGHT_GRAY};
  stroke-width: 1;
`;

const PointDot = styled.circle<{ highlighted: boolean }>`
  fill: ${({ highlighted }) => (highlighted ? Colors.PRIMARY : Colors.MEDIUM_GRAY)};
  fill-opacity: ${({ highlighted }) => (highlighted ? 1 : 0.4)};
`;

interface Props {
  distribution: SliderHistogramPairedDistribution;
}

const PAD = 16;
const VIEW_W = 320;
const VIEW_H = 240;

export function SliderHistogramPairedRenderer({ distribution }: Props) {
  const { x_min, x_max, y_min, y_max, points, user_point: userPoint } = distribution;
  if (x_min === null || x_max === null || y_min === null || y_max === null) {
    return null;
  }
  // Plot area in viewport coords. (PAD..VIEW_W-PAD) for x, (VIEW_H-PAD..PAD)
  // for y so y axis grows upward in the SVG (which has y=0 at top).
  const plotW = VIEW_W - 2 * PAD;
  const plotH = VIEW_H - 2 * PAD;
  const scaleX = (x: number) => PAD + ((x - x_min) / Math.max(1, x_max - x_min)) * plotW;
  const scaleY = (y: number) => VIEW_H - PAD - ((y - y_min) / Math.max(1, y_max - y_min)) * plotH;

  return (
    <Layout.FlexCol gap={6} w="100%">
      <Frame viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="none">
        {/* Axes */}
        <Axis x1={PAD} y1={VIEW_H - PAD} x2={VIEW_W - PAD} y2={VIEW_H - PAD} />
        <Axis x1={PAD} y1={PAD} x2={PAD} y2={VIEW_H - PAD} />

        {/* Population points */}
        {points.map((p, i) => (
          <PointDot
            // eslint-disable-next-line react/no-array-index-key
            key={`p${i}-${p.x}-${p.y}`}
            cx={scaleX(p.x)}
            cy={scaleY(p.y)}
            r={3}
            highlighted={false}
          />
        ))}

        {/* Viewer's own point — drawn last so it sits on top, larger so it's
            visible at a glance even amid dense population data. */}
        {userPoint && (
          <PointDot cx={scaleX(userPoint.x)} cy={scaleY(userPoint.y)} r={6} highlighted />
        )}
      </Frame>
    </Layout.FlexCol>
  );
}
