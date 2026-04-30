import styled from 'styled-components';

import { Colors, Layout } from '@design-system';
import i18n from '@i18n/index';
import { SurveyDistribution } from '@models/survey';

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
  width: 64px;
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

interface SurveyResultsChartProps {
  distribution: SurveyDistribution;
}

const pickLabel = (en: string, ko: string) => (i18n.language === 'ko' ? ko : en);

export function SurveyResultsChart({ distribution }: SurveyResultsChartProps) {
  if (distribution.kind === 'aggregated_likert') {
    const max = Math.max(1, ...distribution.bins.map((b) => b.count));
    return (
      <Col>
        {distribution.bins.map((b) => {
          const isUser = b.score === distribution.user_score;
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
      </Col>
    );
  }
  const max = Math.max(1, ...distribution.options.map((o) => o.count));
  const userChoice = distribution.user_choice;
  const isUser = (value: number) =>
    Array.isArray(userChoice) ? userChoice.includes(value) : userChoice === value;
  return (
    <Col>
      {distribution.options.map((o) => (
        <Row key={o.option_id}>
          <ScoreLabel>{pickLabel(o.label_en, o.label_ko)}</ScoreLabel>
          <BarTrack>
            <Bar style={{ width: `${(o.count / max) * 100}%` }} highlighted={isUser(o.value)} />
          </BarTrack>
          <Count>{o.count}</Count>
        </Row>
      ))}
    </Col>
  );
}
