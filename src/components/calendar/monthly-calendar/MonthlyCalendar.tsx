import { useCallback, useEffect, useMemo, useState } from 'react';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { CALENDAR_VIEW, DayMoment } from '@models/calendar';
import { useBoundStore } from '@stores/useBoundStore';
import { getMomentRequestParams, getMonthlyMoments } from '@utils/apis/moment';
import { mapMomentToCalendar } from '../_helpers/mapMomentToCalendar';
import CalendarCell from '../calendar-cell/CalendarCell';
import CalendarViewWrapper from '../calendar-view-wrapper/CalendarViewWrapper';
import { getCalendarMatrix, getCalendarMonth } from './MonthlyCalendar.helper';

function MonthlyCalendar() {
  const { currentDate, moveToPrevMonth, moveToNextMonth } = useBoundStore((state) => ({
    currentDate: state.myPageCurrDate,
    moveToPrevMonth: state.subMonthFromCurrDate,
    moveToNextMonth: state.addMonthFromCurrDate,
  }));
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
