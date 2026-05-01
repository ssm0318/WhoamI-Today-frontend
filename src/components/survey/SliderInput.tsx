import styled from 'styled-components';

import { Colors, Layout, Typo } from '@design-system';

const Range = styled.input`
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  border-radius: 2px;
  background: ${Colors.LIGHT_GRAY};
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${Colors.PRIMARY};
    cursor: pointer;
    border: none;
  }

  &::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${Colors.PRIMARY};
    cursor: pointer;
    border: none;
  }
`;

interface SliderInputProps {
  min: number;
  max: number;
  value: number | undefined;
  onChange: (v: number) => void;
  lowLabel?: string;
  highLabel?: string;
}

export function SliderInput({ min, max, value, onChange, lowLabel, highLabel }: SliderInputProps) {
  // Display midpoint when the user hasn't picked yet — the slider has to render
  // at *some* position, but `isAnswered` in SurveyAnswerForm only flips true once
  // onChange fires (i.e. the user actually moves it).
  const displayValue = value ?? Math.round((min + max) / 2);
  const showsValue = value !== undefined && value !== null;

  return (
    <Layout.FlexCol gap={8} w="100%">
      <Layout.FlexRow w="100%" justifyContent="center">
        <Typo type="title-large" color={showsValue ? 'PRIMARY' : 'MEDIUM_GRAY'} bold>
          {showsValue ? value : '—'}
        </Typo>
      </Layout.FlexRow>
      <Range
        type="range"
        min={min}
        max={max}
        step={1}
        value={displayValue}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        aria-label="slider answer"
      />
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
