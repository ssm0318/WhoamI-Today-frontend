import styled from 'styled-components';

import { Colors, Layout, Typo } from '@design-system';
import { SliderHistogramDistribution } from '@models/survey';

const CHART_HEIGHT = 96;

const ChartArea = styled(Layout.FlexRow)`
  width: 100%;
  align-items: flex-end;
  gap: 4px;
  height: ${CHART_HEIGHT}px;
`;

const Bar = styled.div<{ pct: number; highlighted: boolean }>`
  flex: 1;
  height: ${({ pct }) => Math.max(2, pct * CHART_HEIGHT)}px;
  background: ${({ highlighted }) => (highlighted ? Colors.PRIMARY : Colors.LIGHT_GRAY)};
  border-radius: 4px 4px 0 0;
  transition: height 200ms ease-out;
  min-height: 2px;
`;

const AxisRow = styled(Layout.FlexRow)`
  width: 100%;
  justify-content: space-between;
`;

const StatsRow = styled(Layout.FlexRow)`
  width: 100%;
  justify-content: flex-start;
  gap: 16px;
  margin-top: 8px;
`;

interface Props {
  distribution: SliderHistogramDistribution;
}

const formatStat = (n: number | null): string => (n === null ? '—' : `${n}`);

export function SliderHistogramRenderer({ distribution }: Props) {
  const { bins, mean, median, min_value, max_value, user_value } = distribution;
  const max = Math.max(1, ...bins.map((b) => b.count));

  // The bin holding the viewer's own value (highlight one bar). Last bin is
  // closed on the right to match the backend's clamp at max_value.
  const userBinIdx =
    user_value !== null && bins.length > 0
      ? bins.findIndex((b, i) =>
          i === bins.length - 1
            ? user_value >= b.lo && user_value <= b.hi
            : user_value >= b.lo && user_value < b.hi,
        )
      : -1;

  return (
    <Layout.FlexCol gap={6} w="100%">
      <ChartArea>
        {bins.map((b, i) => (
          <Bar
            // bins have unique [lo, hi) so lo is a stable key
            key={`${b.lo}-${b.hi}`}
            pct={b.count / max}
            highlighted={i === userBinIdx}
          />
        ))}
      </ChartArea>
      <AxisRow>
        <Typo type="label-medium" color="DARK_GRAY">
          {formatStat(min_value)}
        </Typo>
        <Typo type="label-medium" color="DARK_GRAY">
          {formatStat(max_value)}
        </Typo>
      </AxisRow>
      <StatsRow>
        <Typo type="label-large" color="DARK_GRAY">
          mean&nbsp;{formatStat(mean)}
        </Typo>
        <Typo type="label-large" color="DARK_GRAY">
          median&nbsp;{formatStat(median)}
        </Typo>
      </StatsRow>
    </Layout.FlexCol>
  );
}
