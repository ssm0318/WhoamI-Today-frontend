import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { SvgIcon } from '@design-system';
import * as S from './TimePicker.styled';

interface TimePickerProps {
  onTimeChange: (time: string) => void;
  initialTime: string; // 'HH:MM'
}

function TimePicker({ onTimeChange, initialTime }: TimePickerProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'time' });
  const [hours, setHours] = useState(parseInt(initialTime.split(':')[0], 10) || 12);
  const [minutes, setMinutes] = useState(parseInt(initialTime.split(':')[1], 10) || 0);
  const [period, setPeriod] = useState(parseInt(initialTime.split(':')[1], 10) >= 30 ? 'PM' : 'AM');

  const incrementHours = () => {
    const newHours = hours === 12 ? 1 : hours + 1;
    setHours(newHours);
    updateTime(newHours, minutes, period);
  };

  const decrementHours = () => {
    const newHours = hours === 1 ? 12 : hours - 1;
    setHours(newHours);
    updateTime(newHours, minutes, period);
  };

  const incrementMinutes = () => {
    const newMinutes = minutes === 59 ? 0 : minutes + 1;
    setMinutes(newMinutes);
    updateTime(hours, newMinutes, period);
  };

  const decrementMinutes = () => {
    const newMinutes = minutes === 0 ? 59 : minutes - 1;
    setMinutes(newMinutes);
    updateTime(hours, newMinutes, period);
  };

  const togglePeriod = () => {
    const newPeriod = period === 'AM' ? 'PM' : 'AM';
    setPeriod(newPeriod);
    updateTime(hours, minutes, newPeriod);
  };

  const updateTime = (h: number, m: number, p: string) => {
    // Convert to 24-hour format
    let hour24 = h;
    if (p === 'PM' && h !== 12) hour24 += 12;
    if (p === 'AM' && h === 12) hour24 = 0;

    const timeString = `${hour24.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    onTimeChange(timeString);
  };

  return (
    <S.Container rounded={8} w="100%" justifyContent="center">
      <S.TimePickerWrapper justifyContent="center" alignItems="center" gap={8}>
        {/* Hours */}
        <S.TimeUnit>
          <S.Button onClick={incrementHours}>
            <SvgIcon size={16} name="chevron_up" />
          </S.Button>
          <S.TimeDisplay>{hours.toString().padStart(2, '0')}</S.TimeDisplay>
          <S.Button onClick={decrementHours}>
            <SvgIcon size={16} name="chevron_down" />
          </S.Button>
        </S.TimeUnit>

        <S.Separator>:</S.Separator>

        {/* Minutes */}
        <S.TimeUnit>
          <S.Button onClick={incrementMinutes}>
            <SvgIcon size={16} name="chevron_up" />
          </S.Button>
          <S.TimeDisplay>{minutes.toString().padStart(2, '0')}</S.TimeDisplay>
          <S.Button onClick={decrementMinutes}>
            <SvgIcon size={16} name="chevron_down" />
          </S.Button>
        </S.TimeUnit>

        {/* AM/PM */}
        <S.PeriodButton onClick={togglePeriod}>
          {period === 'AM' ? t('AM') : t('PM')}
        </S.PeriodButton>
      </S.TimePickerWrapper>
    </S.Container>
  );
}

export default TimePicker;
