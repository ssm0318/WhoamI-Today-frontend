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

// 24시간 형식을 12시간 형식으로 변환 (초기값 설정용)
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
 * HH:MM 형식의 시간을 가져옴
 * @param time HH:MM
 */
export const getDailyNotiTime = (time: string) => {
  const { hours, minutes, period } = convert24to12Format(time);
  return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * 영어는 서수 접미사를 포함하고 한국어는 적절한 형식으로 날짜를 포맷팅
 * @param dateString - ISO 날짜 문자열
 * @returns 현재 언어 설정에 따른 포맷팅된 날짜 문자열
 */
export const getFormattedDate = (dateString: string): string => {
  const date = new Date(dateString);
  const currentLanguage = i18n.language;

  if (currentLanguage.startsWith('ko')) {
    // 한국어 형식: YYYY년 MM월 DD일
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  // 영어 형식: Mar. 19th 2025
  return date
    .toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    .replace(/(\d+)/, (d) => `${d}${getOrdinalSuffix(parseInt(d, 10))}`);
};

/**
 * 포맷팅된 날짜 문자열에서 원시 Date 객체를 얻는 도우미 함수
 * 한국어와 영어 포맷 모두 지원
 * @param formattedDate - 포맷팅된 날짜 문자열
 * @returns 정렬용 Date 객체
 */
export const getDateFromFormattedString = (formattedDate: string): Date => {
  // 원본 날짜는 그룹화 과정에서 데이터 속성으로 저장됨
  // 포맷된 문자열을 직접 파싱할 수 없는 경우 이 접근 방식을 사용할 수 있음
  // 이 함수는 더 정확한 구현을 위해 실제 날짜 문자열이 필요함

  // 영어 형식 날짜 (예: "Mar 19th 2025")
  const englishMatch = formattedDate.match(/([A-Za-z]+)\s+(\d+)(?:st|nd|rd|th)?\s+(\d+)/);
  if (englishMatch) {
    const [, month, day, year] = englishMatch;
    const monthMap: Record<string, number> = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };
    return new Date(Number(year), monthMap[month] || 0, Number(day));
  }

  // 한국어 형식 날짜 (예: "2025년 3월 19일")
  const koreanMatch = formattedDate.match(/(\d+)년\s+(\d+)월\s+(\d+)일/);
  if (koreanMatch) {
    const [, year, month, day] = koreanMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  // 형식을 인식할 수 없는 경우 현재 날짜로 폴백
  return new Date();
};

/**
 * 숫자에 대한 서수 접미사 가져오기 (1st, 2nd, 3rd, 등)
 * @param day - 일(day) 숫자
 * @returns 서수 접미사
 */
function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}
