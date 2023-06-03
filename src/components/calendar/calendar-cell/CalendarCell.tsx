import { format, isToday } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { DETAIL_DATE_PARAM_FORMAT } from '@constants/url';
import { Font } from '@design-system';
import { DayMoment } from '@models/calendar';
import { getFirstEmoji } from './CalendarCell.helper';
import * as S from './CalendarCell.styled';

interface CalendarCellProps {
  dayMoment: DayMoment | null;
}

function CalendarCell({ dayMoment }: CalendarCellProps) {
  const { date, moment } = dayMoment || {};
  const navigate = useNavigate();

  const handleClickCell = () => {
    // TODO: Moment 또는 Questions가 없으면 클릭방지.
    if (!date || !moment) return;

    navigate(`/my/detail/${format(date, DETAIL_DATE_PARAM_FORMAT)}`);
  };

  return date ? (
    <S.DateCell isToday={isToday(date)} url={moment?.photo} onClick={handleClickCell}>
      {moment?.mood && <p className="mood">{getFirstEmoji(moment.mood)}</p>}
      <Font.Body type="14_semibold" color="BASIC_WHITE" textAlign="center">
        {format(date, 'dd')}
      </Font.Body>
    </S.DateCell>
  ) : (
    <S.EmptyCell />
  );
}

export default CalendarCell;
