import { format } from 'date-fns';
import i18n from '@i18n/index';

export const secondsToMs = (n: number) => n * 1000;
export const minToMs = (n: number) => n * 1000 * 60;
export const hoursToMs = (n: number) => n * 1000 * 60 * 60;
export const dayToMs = (n: number) => n * 1000 * 60 * 60 * 24;

/**
 * 해당 날짜 00:00:00 반환
 */
export const getStartOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

/**
 * 해당 날짜 hh:00:00 반환
 */
export const getStartOfHour = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0, 0);

/**
 * 해당 날짜 hh:mm:00 반환
 */
export const getStartOfMinute = (date: Date) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    0,
  );

/**
 * 기준날로부터 며칠 지났는지 일, 시간, 분을 반환
 * D-(n), H-(n), M-(n) 의 의미
 * ex) 2023.12.31 11:59:59 와 2024.01.01 12:00:00 의 diffDay는 1 (1분 차이이지만 날짜의 차이로 따지기 때문)
 *
 * @param day1 기준날
 * @param day2 비교하고자 하는날
 */
export const getPastDate = (day1: Date | string, day2: Date | string) => {
  const Day1 = new Date(day1);
  const Day2 = new Date(day2);

  const day1Obj = {
    startOfDay: getStartOfDay(Day1),
    startOfHour: getStartOfHour(Day1),
    startOfMinute: getStartOfMinute(Day1),
  };
  const day2Obj = {
    startOfDay: getStartOfDay(Day2),
    startOfHour: getStartOfHour(Day2),
    startOfMinute: getStartOfMinute(Day2),
  };

  const diffDay = Math.floor(
    Math.abs(day1Obj.startOfDay.getTime() - day2Obj.startOfDay.getTime()) / dayToMs(1),
  );

  const diffHour = Math.floor(
    Math.abs(day1Obj.startOfHour.getTime() - day2Obj.startOfHour.getTime()) / hoursToMs(1),
  );

  const diffMin = Math.floor(
    Math.abs(day1Obj.startOfMinute.getTime() - day2Obj.startOfMinute.getTime()) / minToMs(1),
  );

  return { diffDay, diffHour, diffMin };
};

export const convertTimeDiffByString = (now: Date, day: Date | string) => {
  const { diffHour, diffMin, diffDay } = getPastDate(now, day);

  if (diffDay >= 7) {
    // 7일 이상 차이나는 경우 날짜를 보여줌
    return format(new Date(day), 'yyyy.MM.dd');
  }

  if (diffDay >= 2) {
    // 2일 이상 차이나는 경우 '며칠 전'을 보여줌
    return i18n.t('time.day_ago_other', { day: diffDay });
  }

  if (diffDay >= 1) {
    // 1일 차이나는 경우 '어제'를 보여줌
    return i18n.t('time.day_ago_one');
  }

  if (diffHour < 1) {
    // 1시간 이내 차이나는 경우 '몇분 전'을 보여줌
    if (diffMin === 1) {
      return i18n.t('time.minute_ago_one', { minute: diffMin });
    }
    return i18n.t('time.minute_ago_other', { minute: diffMin });
  }

  if (diffMin < 1) {
    return i18n.t('time.just_a_moment_ago');
  }

  if (diffHour === 1) {
    return i18n.t('time.hour_ago_one', { hour: diffHour });
  }

  return i18n.t('time.hour_ago_other', { hour: diffHour });
};
