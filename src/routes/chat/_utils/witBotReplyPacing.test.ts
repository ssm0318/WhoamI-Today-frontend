/* eslint-env jest */

import { getWitBotReplyRevealDelay } from './witBotReplyPacing';

describe('getWitBotReplyRevealDelay', () => {
  it('keeps the first bot reply quick but perceptible', () => {
    expect(getWitBotReplyRevealDelay({ content: 'Audit time.' }, 0)).toBe(320);
  });

  it('adds a small amount of wait for longer text without becoming slow', () => {
    const delay = getWitBotReplyRevealDelay(
      {
        content:
          'Engaged (2): answer a daily question, open Discover. Not yet (3): complete a survey, tap the subscribe bell, post a check-in.',
      },
      1,
    );

    expect(delay).toBeGreaterThan(500);
    expect(delay).toBeLessThanOrEqual(1200);
  });

  it('keeps button cards snappy because they naturally ask for input', () => {
    expect(
      getWitBotReplyRevealDelay(
        {
          content: 'How do you want to play this?',
          bot_payload: { kind: 'card', buttons: [] },
        },
        2,
      ),
    ).toBe(420);
  });
});
