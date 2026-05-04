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
  onSelect: (v: number | null) => void;
  // Inclusive lower / upper bounds. Default 1..5 keeps existing call sites
  // working without churn.
  min?: number;
  max?: number;
  lowLabel?: string;
  highLabel?: string;
  // When set, an extra "N/A" chip appears at the right of the row. Picking
  // it stores `null` (NA_SENTINEL on the backend) — distinct from "unanswered".
  naLabel?: string;
}

export function LikertChips({
  selected,
  onSelect,
  min = 1,
  max = 5,
  lowLabel,
  highLabel,
  naLabel,
}: LikertChipsProps) {
  // Build the integer range eagerly — likert variants are bounded (3..7 points)
  // so the array is always small.
  const values: number[] = [];
  for (let v = min; v <= max; v += 1) values.push(v);
  return (
    <Layout.FlexCol gap={4} w="100%">
      <ChipsRow>
        {values.map((v) => (
          <Chip key={v} type="button" selected={selected === v} onClick={() => onSelect(v)}>
            {v}
          </Chip>
        ))}
        {naLabel && (
          <Chip
            type="button"
            // `selected === null` reads ambiguous (null also means "not answered"),
            // so the controlling form passes `selected: -1` for N/A picks. This
            // component treats the sentinel locally — see SurveyAnswerForm for
            // the mapping back to the API's null payload.
            selected={selected === -1}
            onClick={() => onSelect(-1)}
          >
            {naLabel}
          </Chip>
        )}
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
