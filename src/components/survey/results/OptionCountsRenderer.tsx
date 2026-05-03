import styled from 'styled-components';

import { Colors, Layout } from '@design-system';
import i18n from '@i18n/index';
import { OptionCountsDistribution } from '@models/survey';

const Col = styled(Layout.FlexCol)`
  width: 100%;
  gap: 6px;
`;

const Row = styled(Layout.FlexRow)`
  width: 100%;
  align-items: center;
  gap: 8px;
`;

const Label = styled.div<{ highlighted: boolean }>`
  width: 96px;
  font-size: 14px;
  font-weight: ${({ highlighted }) => (highlighted ? 700 : 400)};
  color: ${({ highlighted }) => (highlighted ? Colors.PRIMARY : Colors.DARK_GRAY)};
  flex-shrink: 0;
`;

const BarTrack = styled.div`
  flex: 1;
  height: 14px;
  border-radius: 7px;
`;

const Bar = styled.div<{ highlighted: boolean }>`
  height: 100%;
  background: ${({ highlighted }) => (highlighted ? Colors.PRIMARY : Colors.LIGHT_GRAY)};
  border-radius: 7px;
  transition: width 200ms ease-out;
`;

const Count = styled.div<{ highlighted: boolean }>`
  width: 32px;
  font-size: 14px;
  font-weight: ${({ highlighted }) => (highlighted ? 700 : 400)};
  color: ${({ highlighted }) => (highlighted ? Colors.PRIMARY : Colors.DARK_GRAY)};
  text-align: right;
  flex-shrink: 0;
`;

const pickLabel = (en: string, ko: string) => (i18n.language === 'ko' ? ko : en);

interface Props {
  distribution: OptionCountsDistribution;
}

export function OptionCountsRenderer({ distribution }: Props) {
  const max = Math.max(1, ...distribution.options.map((o) => o.count));
  const userChoice = distribution.user_choice;
  const isUser = (value: number) =>
    Array.isArray(userChoice) ? userChoice.includes(value) : userChoice === value;
  return (
    <Col>
      {distribution.options.map((o) => {
        const highlighted = isUser(o.value);
        return (
          <Row key={o.option_id}>
            <Label highlighted={highlighted}>{pickLabel(o.label_en, o.label_ko)}</Label>
            <BarTrack>
              <Bar style={{ width: `${(o.count / max) * 100}%` }} highlighted={highlighted} />
            </BarTrack>
            <Count highlighted={highlighted}>{o.count}</Count>
          </Row>
        );
      })}
    </Col>
  );
}
