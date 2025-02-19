import { format, isSameDay, isToday } from 'date-fns';
import { Font } from '@design-system';
import { DayMoment } from '@models/calendar';
import { useBoundStore } from '@stores/useBoundStore';
import { getFirstEmoji } from './CalendarCell.helper';
import * as S from './CalendarCell.styled';

interface CalendarCellProps {
  dayMoment: DayMoment | null;
}

function CalendarCell({ dayMoment }: CalendarCellProps) {
  const { date, moment } = dayMoment || {};
  const { detailDate, setDetailDate } = useBoundStore((state) => ({
    detailDate: state.detailDate,
    setDetailDate: state.setDetailDate,
  }));

  const handleClickCell = () => {
    if (!date) return;
    setDetailDate(date);
  };

  return date ? (
    <S.DateCell
      isSelected={detailDate && isSameDay(date, detailDate)}
      url={moment?.photo}
      onClick={handleClickCell}
    >
      {moment?.mood && <p className="mood">{getFirstEmoji(moment.mood)}</p>}
      <Font.Body type="14_semibold" color={isToday(date) ? 'PRIMARY' : 'WHITE'} textAlign="center">
        {format(date, 'dd')}
      </Font.Body>
    </S.DateCell>
  ) : (
    <S.EmptyCell />
  );
}

export default CalendarCell;
