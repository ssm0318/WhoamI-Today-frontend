import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DayOfWeek } from '@models/api/user';
import * as S from './WeekPicker.styled';

interface WeekPickerProps {
  onWeekChange: (selectedDays: DayOfWeek[]) => void;
  initialDays?: DayOfWeek[];
  disabled?: boolean;
}

function WeekPicker({ onWeekChange, initialDays = [], disabled = false }: WeekPickerProps) {
  const [t] = useTranslation('translation');
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(initialDays);

  const daysOfWeek: DayOfWeek[] = ['0', '1', '2', '3', '4', '5', '6'];

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
    <S.Container w="100%" justifyContent="center" p={16} rounded={12}>
      <S.WeekPickerWrapper w="100%" justifyContent="center" alignItems="center" gap={8}>
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
