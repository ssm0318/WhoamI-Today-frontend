import styled from 'styled-components';

import { Colors, Layout, Typo } from '@design-system';
import { ScaleScoreHistogramDistribution } from '@models/survey';

const Col = styled(Layout.FlexCol)`
  width: 100%;
  gap: 6px;
`;

const Row = styled(Layout.FlexRow)`
  width: 100%;
  align-items: center;
  gap: 8px;
`;

const ScoreLabel = styled.div`
  width: 48px;
  font-size: 14px;
  color: ${Colors.DARK_GRAY};
  flex-shrink: 0;
`;

const BarTrack = styled.div`
  flex: 1;
  height: 14px;
  background: transparent;
  border-radius: 7px;
  overflow: hidden;
`;

const Bar = styled.div<{ highlighted: boolean }>`
  height: 100%;
  background: ${({ highlighted }) => (highlighted ? Colors.PRIMARY : Colors.LIGHT_GRAY)};
  border-radius: 7px;
  transition: width 200ms ease-out;
`;

const Count = styled.div`
  width: 32px;
  font-size: 14px;
  color: ${Colors.DARK_GRAY};
  text-align: right;
  flex-shrink: 0;
`;

const Stats = styled(Layout.FlexRow)`
  width: 100%;
  gap: 16px;
  margin-top: 4px;
`;

interface Props {
  distribution: ScaleScoreHistogramDistribution;
}

// Scale-score histogram — survey-level summary score per response.
// Visually similar to AggregatedLikertRenderer but its `bins` cover the
// observed score range (min..max from actual responses) rather than the
// theoretical likert sum, and the highlighted bar marks the viewer's
// score (which may be above the visible max — handled via fallback bar).
export function ScaleScoreHistogramRenderer({ distribution }: Props) {
  const { bins, mean, median, user_score: userScore } = distribution;
  const max = Math.max(1, ...bins.map((b) => b.count));
  return (
    <Col>
      {bins.map((b) => {
        const isUser = userScore !== null && b.score === userScore;
        return (
          <Row key={b.score}>
            <ScoreLabel>{b.score}</ScoreLabel>
            <BarTrack>
              <Bar style={{ width: `${(b.count / max) * 100}%` }} highlighted={isUser} />
            </BarTrack>
            <Count>{b.count}</Count>
          </Row>
        );
      })}
      {mean !== null && (
        <Stats>
          <Typo type="label-medium" color="DARK_GRAY">
            mean {mean}
          </Typo>
          {median !== null && (
            <Typo type="label-medium" color="DARK_GRAY">
              median {median}
            </Typo>
          )}
          {userScore !== null && (
            <Typo type="label-medium" color="PRIMARY">
              you {userScore}
            </Typo>
          )}
        </Stats>
      )}
    </Col>
  );
}
