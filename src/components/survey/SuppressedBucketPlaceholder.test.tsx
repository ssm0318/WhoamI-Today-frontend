/* eslint-env jest */

import { render, screen } from '@testing-library/react';
import type { ComponentType, ReactNode } from 'react';
import React from 'react';

import type { SuppressedReason } from '@models/survey';

import enTranslations from '../../i18n/locales/en/translation.json';
import koTranslations from '../../i18n/locales/ko/translation.json';
import { SuppressedBucketPlaceholder } from './SuppressedBucketPlaceholder';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const messages: Record<string, string> = {
        'reasons.too_few_responders_population': 'Available once 5 WIT users have responded.',
        'reasons.too_few_responders_friends': 'Available once 5 of your friends have responded.',
        'reasons.too_few_responders_close_friends':
          'Available once 5 of your close friends have responded.',
        'reasons.too_few_responders': 'Available once 5 of your friends have responded.',
      };
      return messages[key] ?? key;
    },
  }),
}));

jest.mock(
  '@components/profile/placeholders/Placeholder.styled',
  () => ({
    PlaceholderWrapper: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  }),
  { virtual: true },
);

jest.mock(
  '@design-system',
  () => {
    function MockTypo({ children }: { children?: ReactNode }) {
      return <span>{children}</span>;
    }

    return {
      Colors: {
        DARK_GRAY: '#555',
        LIGHT_GRAY: '#ddd',
      },
      Typo: MockTypo,
    };
  },
  { virtual: true },
);

type PlaceholderWithAudienceProps = {
  reason: SuppressedReason;
  audience?: 'population' | 'friends' | 'close_friends';
};

const PlaceholderWithAudience =
  SuppressedBucketPlaceholder as ComponentType<PlaceholderWithAudienceProps>;

describe('SuppressedBucketPlaceholder', () => {
  it('uses WIT users copy when the everyone bucket needs more responders', () => {
    render(<PlaceholderWithAudience reason="too_few_responders" audience="population" />);

    expect(screen.getByText('Available once 5 WIT users have responded.')).toBeInTheDocument();
    expect(
      screen.queryByText('Available once 5 of your friends have responded.'),
    ).not.toBeInTheDocument();
  });

  it('keeps friend-specific copy for friend result buckets', () => {
    render(<PlaceholderWithAudience reason="too_few_responders" audience="friends" />);

    expect(
      screen.getByText('Available once 5 of your friends have responded.'),
    ).toBeInTheDocument();
  });
});

describe('survey result panel translations', () => {
  it('has participant-facing labels for scale score histogram panels', () => {
    expect(enTranslations.surveys.panel_kinds.scale_score_histogram).toBeTruthy();
    expect(koTranslations.surveys.panel_kinds.scale_score_histogram).toBeTruthy();
  });
});
