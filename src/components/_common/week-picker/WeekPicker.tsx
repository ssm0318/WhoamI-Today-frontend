import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './WeekPicker.styled';

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, etc.

interface WeekPickerProps {
  onWeekChange: (selectedDays: DayOfWeek[]) => void;
  initialDays?: DayOfWeek[];
  disabled?: boolean;
}

function WeekPicker({ onWeekChange, initialDays = [], disabled = false }: WeekPickerProps) {
  const [t] = useTranslation('translation');
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(initialDays);

  const daysOfWeek: DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];

  const toggleDay = (day: DayOfWeek) => {
    if (disabled) return;

    const newSelectedDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];

    setSelectedDays(newSelectedDays);
    onWeekChange(newSelectedDays);
  };

  const getDayLabel = (day: DayOfWeek) => {
    const dayLabel = t(`time.day.short.${day}`);
    return (dayLabel.charAt(0) + dayLabel.slice(1)).toUpperCase();
  };

  return (
    <S.Container rounded={8} w="100%" justifyContent="center">
      <S.WeekPickerWrapper justifyContent="center" alignItems="center" gap={8}>
        {daysOfWeek.map((day) => (
          <S.DayButton
            key={day}
            onClick={() => toggleDay(day)}
            selected={selectedDays.includes(day)}
            disabled={disabled}
            type="button"
          >
            {getDayLabel(day)}
          </S.DayButton>
        ))}
      </S.WeekPickerWrapper>
    </S.Container>
  );
}

export default WeekPicker;
