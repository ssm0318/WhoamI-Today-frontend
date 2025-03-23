import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { SvgIcon } from '@design-system';
import { convert24to12Format } from '@utils/timeHelpers';
import * as S from './TimePicker.styled';

interface TimePickerProps {
  onTimeChange: (time: string) => void;
  initialTime: string; // 'HH:MM'
}

function TimePicker({ onTimeChange, initialTime }: TimePickerProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'time' });

  const {
    hours: initialHours,
    minutes: initialMinutes,
    period: initialPeriod,
  } = convert24to12Format(initialTime);

  // Round initial minutes to the nearest 15
  const roundedInitialMinutes = Math.round(initialMinutes / 15) * 15;
  const normalizedInitialMinutes = roundedInitialMinutes === 60 ? 0 : roundedInitialMinutes;

  const [hours, setHours] = useState(initialHours);
  const [minutes, setMinutes] = useState(normalizedInitialMinutes);
  const [period, setPeriod] = useState(initialPeriod);

  // Available minute options
  const minuteOptions = [0, 15, 30, 45];

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
    const currentIndex = minuteOptions.indexOf(minutes);
    const nextIndex = (currentIndex + 1) % minuteOptions.length;
    const newMinutes = minuteOptions[nextIndex];
    setMinutes(newMinutes);
    updateTime(hours, newMinutes, period);
  };

  const decrementMinutes = () => {
    const currentIndex = minuteOptions.indexOf(minutes);
    const prevIndex = (currentIndex - 1 + minuteOptions.length) % minuteOptions.length;
    const newMinutes = minuteOptions[prevIndex];
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
