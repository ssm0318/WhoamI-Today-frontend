import {
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  nextWednesday,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import i18n from '@i18n/index';
import { CALENDAR_VIEW } from '@models/calendar';

export const ARROW_ICON_SIZE = 36;

export const getArrowIconColor = (isActive: boolean) => (isActive ? 'BLACK' : 'GRAY_1');

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

export const validateNextBtnActivation = (type: CALENDAR_VIEW, currentDate: Date) => {
  const today = new Date();
  const endDate = type === CALENDAR_VIEW.WEEKLY ? endOfWeek(currentDate) : endOfMonth(currentDate);
  return isAfter(today, endDate);
};

export const getCalendarTitle = (type: CALENDAR_VIEW, currentDate: Date) => {
  if (type === CALENDAR_VIEW.MONTHLY) {
    return format(currentDate, i18n.t('calendar.title_format'));
  }

  const startDayOfMonth = startOfMonth(currentDate).getDay();
  const baseDateOfWeek = nextWednesday(startOfWeek(currentDate));

  const baseDay = baseDateOfWeek.getDate();

  const correctionValue = startDayOfMonth <= 3 ? 1 : 0;
  const weekOfMonth = Math.ceil((baseDay - (7 - startDayOfMonth) + 1) / 7) + correctionValue;

  return `${format(baseDateOfWeek, i18n.t('calendar.title_format'))} ${i18n.t('calendar.weeks', {
    count: weekOfMonth,
    ordinal: true,
  })}`;
};
