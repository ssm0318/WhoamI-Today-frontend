import { differenceInHours, differenceInMinutes, format } from 'date-fns';
import i18n from '@i18n/index';
import { DayOfWeek } from '@models/api/user';

const DEFAULT_FORMAT = 'yyyy.MM.dd HH:mm:ss';
type DateFormat = typeof DEFAULT_FORMAT | 'yyyy.MM.dd HH:mm';

/**
 * 현재 날짜와 기준 날짜 차이를 계산 후 포맷팅
 *
 * 1분 이내: 방금 전
 * 1시간 이내: N분 전
 * 24시간 이내: N시간 전
 * 그외: YYYY-MM-DD HH-mm-ss
 *
 * @param now 현재 날짜
 * @param day 기준 날짜
 * @returns
 */
export const convertTimeDiffByString = ({
  now = new Date(),
  day,
  dateFormat = 'yyyy.MM.dd HH:mm',
  isShortFormat = false,
  useSoonText = true,
}: {
  now?: Date;
  day: Date;
  dateFormat?: DateFormat;
  useSoonText?: boolean;
  isShortFormat?: boolean;
}) => {
  const diffMins = differenceInMinutes(now, day);
  const diffHours = differenceInHours(now, day);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffHours / 24 / 7);

  if (diffMins < 1 && useSoonText) {
    return i18n.t('time.just_a_moment_ago');
  }

  if (diffHours < 1) {
    return i18n.t(isShortFormat ? 'time.short.minute' : 'time.minute_ago', { count: diffMins });
  }

  if (diffHours < 24) {
    return i18n.t(isShortFormat ? 'time.short.hour' : 'time.hour_ago', { count: diffHours });
  }

  if (diffDays < 7) {
    return i18n.t(isShortFormat ? 'time.short.day' : 'time.day_ago', { count: diffDays });
  }

  if (diffWeeks < 5) {
    return i18n.t(isShortFormat ? 'time.short.week' : 'time.week_ago', { count: diffWeeks });
  }

  return format(new Date(day), dateFormat ?? DEFAULT_FORMAT);
};

// Convert 24-hour format to 12-hour format for initial values
export const convert24to12Format = (time24: string) => {
  const [hours24, minutes] = time24.split(':').map(Number);
  let period = 'AM';
  let hours12 = hours24;

  if (hours24 >= 12) {
    period = 'PM';
    if (hours24 > 12) {
      hours12 = hours24 - 12;
    }
  }
  if (hours24 === 0) {
    hours12 = 12;
  }

  return {
    hours: hours12,
    minutes: minutes || 0,
    period,
  };
};

/**
 *
 * @param time HH:MM
 */
export const getDailyNotiTime = (time: string) => {
  const { hours, minutes, period } = convert24to12Format(time);
  return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 *
 * @param periodDays DayOfWeek[]
 */
export const getDailyNotiPeriod = (periodDays: DayOfWeek[]) => {
  if (periodDays.length === 7) {
    return i18n.t('time.every_day');
  }
  const days = periodDays.map((day) => i18n.t(`time.day.${day}`));
  return days.join(', ');
};
