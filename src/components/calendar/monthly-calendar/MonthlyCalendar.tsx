import { addMonths, format } from 'date-fns';
import { subMonths } from 'date-fns/esm';
import { useMemo, useState } from 'react';
import { Font, Layout } from '@design-system';
import { DAYS_OF_WEEK, getCalendarMatrix } from './MonthlyCalendar.helper';
import { CalendarTable } from './MonthlyCalendar.styled';

function MonthlyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const datesOfCurrMonth = useMemo(() => getCalendarMatrix(currentDate), [currentDate]);

  const moveToPrevMonth = () => {
    setCurrentDate((prev) => subMonths(prev, 1));
  };

  const moveToNextMonth = () => {
    setCurrentDate((prev) => addMonths(prev, 1));
  };

  return (
    <Layout.FlexCol>
      <Layout.FlexRow>
        <div>
          <Font.Body type="14_semibold">{format(currentDate, 'MMMM yyyy')}</Font.Body>
        </div>
        <div>
          <button type="button" onClick={moveToPrevMonth}>
            {'<'}
          </button>
          <button type="button" onClick={moveToNextMonth}>
            {'>'}
          </button>
        </div>
      </Layout.FlexRow>
      <Layout.FlexCol>
        <CalendarTable>
          <thead>
            <tr>
              {DAYS_OF_WEEK.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {datesOfCurrMonth.map((week, i) => {
              const weekKey = `week_${i}`;
              return (
                <tr key={weekKey}>
                  {week.map((day, j) => {
                    const dayKey = `day_${i}_${j}`;
                    return <th key={dayKey}>{day ? format(day, 'dd') : ''}</th>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </CalendarTable>
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

export default MonthlyCalendar;
