import { addMonths, subMonths } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { CALENDAR_VIEW, DayMoment } from '@models/calendar';
import { getMomentRequestParams, getMonthlyMoments } from '@utils/apis/moment';
import { mapMomentToCalendar } from '../_helpers/mapMomentToCalendar';
import CalendarCell from '../calendar-cell/CalendarCell';
import CalendarViewWrapper from '../calendar-view-wrapper/CalendarViewWrapper';
import { getCalendarMatrix, getCalendarMonth } from './MonthlyCalendar.helper';

function MonthlyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarMonth, setCalendarMonth] = useState<DayMoment[]>([]);
  const calendarMatrix = useMemo(() => getCalendarMatrix(calendarMonth), [calendarMonth]);

  useEffect(() => {
    setCalendarMonth(getCalendarMonth(currentDate));
  }, [currentDate]);

  const updateMonthlyMoments = useCallback(async () => {
    const { year, month } = getMomentRequestParams(currentDate);
    const data = await getMonthlyMoments({ year, month });
    setCalendarMonth((prev) => mapMomentToCalendar(prev, data));
  }, [currentDate]);
  useAsyncEffect(updateMonthlyMoments, [updateMonthlyMoments]);

  const moveToPrevMonth = () => {
    setCurrentDate((prev) => subMonths(prev, 1));
  };

  const moveToNextMonth = () => {
    setCurrentDate((prev) => addMonths(prev, 1));
  };

  return (
    <CalendarViewWrapper
      type={CALENDAR_VIEW.MONTHLY}
      currentDate={currentDate}
      onClickPrevBtn={moveToPrevMonth}
      onClickNextBtn={moveToNextMonth}
    >
      {calendarMatrix.map((week, i) => {
        const weekKey = `week_${i}`;
        return (
          <tr key={weekKey}>
            {week.map((dayMoment, j) => {
              const dateKey = `date_${i}_${j}`;
              return <CalendarCell key={dateKey} dayMoment={dayMoment} />;
            })}
          </tr>
        );
      })}
    </CalendarViewWrapper>
  );
}

export default MonthlyCalendar;
