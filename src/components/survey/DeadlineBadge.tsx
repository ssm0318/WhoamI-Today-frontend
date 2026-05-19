import { useTranslation } from 'react-i18next';

import type { Cadence } from '@models/survey';
import { formatRemainingDeadline } from '@utils/surveyDeadline';

import { Chip } from './DeadlineBadge.styled';

interface Props {
  windowEnd: string | null;
  cadence: Cadence;
  allowLate: boolean;
}

export function DeadlineBadge({ windowEnd, cadence, allowLate }: Props) {
  const { i18n, t } = useTranslation('translation', { keyPrefix: 'deadline_badge' });
  const label = formatRemainingDeadline(windowEnd, cadence, allowLate, {
    locale: i18n.language === 'ko' ? 'ko-KR' : 'en-US',
    formatHoursLeft: (hours) => t('hours_left', { hours }),
    formatClosesWeekday: (weekday) => t('closes_weekday', { weekday }),
    formatDueToday: () => t('due_today'),
    formatDueWeekday: (weekday) => t('due_weekday', { weekday }),
  });

  if (!label) return null;

  return <Chip>⏰ {label}</Chip>;
}
