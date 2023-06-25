import { differenceInHours, differenceInMinutes, format } from 'date-fns';
import i18n from '@i18n/index';

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
export const convertTimeDiffByString = (now: Date, day: Date, dateFormat?: DateFormat) => {
  const diffMins = differenceInMinutes(now, day);
  const diffHours = differenceInHours(now, day);

  if (diffMins < 1) {
    return i18n.t('time.just_a_moment_ago');
  }

  if (diffHours < 1) {
    return i18n.t('time.minute_ago', { minute: diffMins });
  }

  if (diffHours < 24) {
    return i18n.t('time.hour_ago', { hour: diffHours });
  }

  return format(new Date(day), dateFormat ?? DEFAULT_FORMAT);
};

export const getYearMonthDayFromDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return { year, month, day };
};
