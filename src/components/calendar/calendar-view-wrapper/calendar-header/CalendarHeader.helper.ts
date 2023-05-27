import { isBefore, isToday, startOfMonth, startOfWeek } from 'date-fns';
import { CALENDAR_VIEW } from '@models/calendar';

export const ARROW_ICON_SIZE = 36;

export const getArrowIconColor = (isActive: boolean) => (isActive ? 'BASIC_BLACK' : 'GRAY_1');

const FIRST_DATE = new Date(2023, 3, 1); // TODO: 첫 모먼트 게시 날짜를 기준으로 변경

export const validatePrevBtnActivation = (
  type: CALENDAR_VIEW,
  currentDate: Date,
  firstDate = FIRST_DATE,
) => {
  const startDate =
    type === CALENDAR_VIEW.WEEKLY ? startOfWeek(currentDate) : startOfMonth(currentDate);
  return isBefore(firstDate, startDate);
};

export const validateNextBtnActivation = (currentDate: Date) => !isToday(currentDate);
