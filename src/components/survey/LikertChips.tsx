import styled from 'styled-components';

import { Layout, Typo } from '@design-system';

import { Chip } from './Chip.styled';

const ChipsRow = styled(Layout.FlexRow)`
  width: 100%;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
`;

const NaRow = styled(Layout.FlexRow)`
  width: 100%;
  justify-content: flex-end;
  margin-top: 4px;
`;

// Sentinel for the "N/A" pick on likert_5_na questions. Mirrors backend
// `NA_SENTINEL = None` — JSON-serializes to `null`, which the backend's
// aggregation strategies recognize and skip from scoring. Distinct from
// `undefined` (the user hasn't engaged with the question yet).
export const LIKERT_NA_VALUE = null;

interface LikertChipsProps {
  // Inclusive bounds. Likert variants:
  //   likert_3 → 1..3, likert_4 → 1..4, likert_5 → 1..5,
  //   likert_5_na → 1..5 (+ N/A button), likert_6 → 1..6, likert_7 → 1..7.
  min: number;
  max: number;
  selected: number | null | undefined;
  onSelect: (v: number | null) => void;
  lowLabel?: string;
  highLabel?: string;
  // When set (likert_5_na only), renders an N/A button after the numeric
  // chips. Picking it stores LIKERT_NA_VALUE (null).
  naLabel?: string;
}

export function LikertChips({
  min,
  max,
  selected,
  onSelect,
  lowLabel,
  highLabel,
  naLabel,
}: LikertChipsProps) {
  // Build an inclusive [min..max] integer scale. Defensive against
  // inverted bounds: render at least one chip so the form never shows
  // a question with no input at all.
  const values: number[] = [];
  for (let v = min; v <= max; v += 1) values.push(v);
  if (values.length === 0) values.push(min);

  // Distinguish "not engaged" (undefined) from "explicitly N/A" (null) so
  // the N/A button renders selected only when the user actually picked it.
  const naSelected = selected === LIKERT_NA_VALUE;

  return (
    <Layout.FlexCol gap={4} w="100%">
      <ChipsRow>
        {values.map((v) => (
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
      {naLabel && (
        <NaRow>
          <Chip type="button" selected={naSelected} onClick={() => onSelect(LIKERT_NA_VALUE)}>
            {naLabel}
          </Chip>
        </NaRow>
      )}
    </Layout.FlexCol>
  );
}
