/* eslint-env jest */

import { formatRemainingDeadline } from './surveyDeadline';

describe('formatRemainingDeadline', () => {
  it('returns null when late submissions are accepted', () => {
    expect(
      formatRemainingDeadline('2026-05-18', 'daily', true, {
        now: new Date('2026-05-19T05:10:00Z'),
      }),
    ).toBeNull();
  });

  it('returns null when no close date exists', () => {
    expect(
      formatRemainingDeadline(null, 'anytime', false, {
        now: new Date('2026-05-19T05:10:00Z'),
      }),
    ).toBeNull();
  });

  it('returns null for cadences that do not get deadline badges', () => {
    const now = new Date('2026-05-19T05:10:00Z');

    expect(formatRemainingDeadline('2026-05-20', 'biweekly', false, { now })).toBeNull();
    expect(formatRemainingDeadline('2026-05-20', 'anytime', false, { now })).toBeNull();
    expect(formatRemainingDeadline('2026-05-20', 'endpoint', false, { now })).toBeNull();
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

  it('formats weekly close labels with the short weekday', () => {
    expect(
      formatRemainingDeadline('2026-05-24', 'weekly', false, {
        now: new Date('2026-05-19T05:10:00Z'),
        locale: 'en-US',
      }),
    ).toBe('Closes Sun');
  });

  it('allows the caller to localize weekly close labels', () => {
    expect(
      formatRemainingDeadline('2026-05-24', 'weekly', false, {
        now: new Date('2026-05-19T05:10:00Z'),
        locale: 'ko-KR',
        formatClosesWeekday: (weekday) => `${weekday} 마감`,
      }),
    ).toBe('일 마감');
  });
});
