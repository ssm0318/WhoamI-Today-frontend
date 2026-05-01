import styled from 'styled-components';

import { Layout, Typo } from '@design-system';

import { Chip } from './Chip.styled';

const ChipsRow = styled(Layout.FlexRow)`
  width: 100%;
  justify-content: space-between;
  gap: 8px;
`;

interface LikertChipsProps {
  selected: number | null;
  onSelect: (v: number) => void;
  lowLabel?: string;
  highLabel?: string;
}

const VALUES = [1, 2, 3, 4, 5];

export function LikertChips({ selected, onSelect, lowLabel, highLabel }: LikertChipsProps) {
  return (
    <Layout.FlexCol gap={4} w="100%">
      <ChipsRow>
        {VALUES.map((v) => (
          <Chip key={v} type="button" selected={selected === v} onClick={() => onSelect(v)}>
            {v}
          </Chip>
        ))}
      </ChipsRow>
      {(lowLabel || highLabel) && (
        <Layout.FlexRow w="100%" justifyContent="space-between">
          <Typo type="label-medium" color="MEDIUM_GRAY">
            {lowLabel}
          </Typo>
          <Typo type="label-medium" color="MEDIUM_GRAY">
            {highLabel}
          </Typo>
        </Layout.FlexRow>
      )}
    </Layout.FlexCol>
  );
}
