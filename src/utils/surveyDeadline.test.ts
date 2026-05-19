/* eslint-env jest */

import { formatRemainingDeadline, shouldShowNoLateAcceptedBadge } from './surveyDeadline';

describe('formatRemainingDeadline', () => {
  it('still shows the deadline when late submissions are accepted', () => {
    expect(
      formatRemainingDeadline('2026-05-18', 'endpoint', true, {
        now: new Date('2026-05-18T20:10:00Z'),
      }),
    ).toBe('Due today');
  });

  it('returns null when no close date exists', () => {
    expect(
      formatRemainingDeadline(null, 'anytime', false, {
        now: new Date('2026-05-19T05:10:00Z'),
      }),
    ).toBeNull();
  });

  it('shows deadline badges for non-daily surveys with a close date', () => {
    const now = new Date('2026-05-19T05:10:00Z');

    expect(formatRemainingDeadline('2026-05-20', 'biweekly', false, { now })).toBe('Due Wed');
    expect(formatRemainingDeadline('2026-05-20', 'anytime', false, { now })).toBe('Due Wed');
    expect(formatRemainingDeadline('2026-05-20', 'endpoint', false, { now })).toBe('Due Wed');
  });

  it('rounds daily partial hours up against the 7am PT close', () => {
    expect(
      formatRemainingDeadline('2026-05-18', 'daily', false, {
        now: new Date('2026-05-19T05:10:00Z'),
      }),
    ).toBe('9h left');
  });

  it('clamps daily labels to 1h before close', () => {
    expect(
      formatRemainingDeadline('2026-05-18', 'daily', false, {
        now: new Date('2026-05-19T13:55:00Z'),
      }),
    ).toBe('1h left');
  });

  it('returns null after the daily close', () => {
    expect(
      formatRemainingDeadline('2026-05-18', 'daily', false, {
        now: new Date('2026-05-19T14:01:00Z'),
      }),
    ).toBeNull();
  });

  it('formats weekly deadline labels with the short weekday', () => {
    expect(
      formatRemainingDeadline('2026-05-24', 'weekly', false, {
        now: new Date('2026-05-19T05:10:00Z'),
        locale: 'en-US',
      }),
    ).toBe('Due Sun');
  });

  it('uses a tomorrow label for non-daily surveys due the next local day', () => {
    expect(
      formatRemainingDeadline('2026-05-19', 'biweekly', true, {
        now: new Date('2026-05-18T20:00:00Z'),
      }),
    ).toBe('Due tomorrow');
  });

  it('allows the caller to localize non-daily deadline labels', () => {
    expect(
      formatRemainingDeadline('2026-05-24', 'weekly', false, {
        now: new Date('2026-05-19T05:10:00Z'),
        locale: 'ko-KR',
        formatDueWeekday: (weekday) => `${weekday} 마감`,
      }),
    ).toBe('일 마감');
  });
});

describe('shouldShowNoLateAcceptedBadge', () => {
  it('shows only when a survey has a close date and late submissions are not accepted', () => {
    expect(shouldShowNoLateAcceptedBadge('2026-05-18', false)).toBe(true);
    expect(shouldShowNoLateAcceptedBadge('2026-05-18', true)).toBe(false);
    expect(shouldShowNoLateAcceptedBadge(null, false)).toBe(false);
  });
});
