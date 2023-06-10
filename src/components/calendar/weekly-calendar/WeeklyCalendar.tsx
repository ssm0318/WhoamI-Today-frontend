import { startOfWeek } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { CALENDAR_VIEW, DayMoment } from '@models/calendar';
import { useBoundStore } from '@stores/useBoundStore';
import { getMomentRequestParams, getWeeklyMoments } from '@utils/apis/moment';
import { mapMomentToCalendar } from '../_helpers/mapMomentToCalendar';
import CalendarCell from '../calendar-cell/CalendarCell';
import CalendarViewWrapper from '../calendar-view-wrapper/CalendarViewWrapper';
import { getCalendarWeek } from './WeeklyCalendar.helper';

function WeeklyCalendar() {
  const { currentDate, moveToPrevWeek, moveToNextWeek } = useBoundStore((state) => ({
    currentDate: state.myPageCurrDate,
    moveToPrevWeek: state.subWeekFromCurrDate,
    moveToNextWeek: state.addWeekFromCurrDate,
  }));
  const [calendarWeek, setCalendarWeek] = useState<DayMoment[]>([]);

  useEffect(() => {
    setCalendarWeek(getCalendarWeek(currentDate));
  }, [currentDate]);

  const updateWeeklyMoments = useCallback(async () => {
    const { year, month, day } = getMomentRequestParams(startOfWeek(currentDate));
    const data = await getWeeklyMoments({ year, month, day });
    setCalendarWeek((prev) => mapMomentToCalendar(prev, data));
  }, [currentDate]);
  useAsyncEffect(updateWeeklyMoments, [updateWeeklyMoments]);

  return (
    <CalendarViewWrapper
      type={CALENDAR_VIEW.WEEKLY}
      currentDate={currentDate}
      onClickPrevBtn={moveToPrevWeek}
      onClickNextBtn={moveToNextWeek}
    >
      <tr>
        {calendarWeek.map((dayMoment, i) => {
          const dateKey = `date_${i}`;
          return <CalendarCell key={dateKey} dayMoment={dayMoment} />;
        })}
      </tr>
    </CalendarViewWrapper>
  );
}

export default WeeklyCalendar;
