/* eslint-env jest */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';

import { SurveyFeatureText } from './SurveyFeatureText';

jest.mock(
  '@constants/layout',
  () => ({
    Z_INDEX: { ALERT_DIALOG: 1600 },
  }),
  { virtual: true },
);

jest.mock(
  '@design-system',
  () => {
    const React = jest.requireActual<typeof import('react')>('react');
    function MockTypo({ children }: { children?: ReactNode }) {
      return React.createElement('span', null, children);
    }

    return {
      Colors: {
        BLACK: '#000',
        DARK_GRAY: '#555',
        LIGHT: '#f8f8f8',
        LIGHT_GRAY: '#ddd',
        MEDIUM_GRAY: '#999',
        PRIMARY: '#8700ff',
        WHITE: '#fff',
      },
      SvgIcon: () => React.createElement('span', null, 'icon'),
      Typo: MockTypo,
    };
  },
  { virtual: true },
);

describe('SurveyFeatureText', () => {
  it('renders approved feature names as clickable text that opens screenshot modal', () => {
    render(
      <SurveyFeatureText
        text="What did you enjoy about daily questions?"
        surveySlug="feature_eval_w"
        questionSlug="goal1_feat_dailyq_enjoy"
        type="title-medium"
      />,
    );

    userEvent.click(screen.getByRole('button', { name: 'View Daily Questions screenshots' }));

    expect(screen.getByRole('dialog', { name: 'Daily Questions' })).toBeInTheDocument();
    expect(screen.getByAltText('Daily Questions screenshot')).toHaveAttribute(
      'src',
      '/survey-feature-screenshots/goal1_feat_dailyq-01.png',
    );
  });

  it('surfaces carousel controls when a feature has multiple screenshots', () => {
    render(
      <SurveyFeatureText
        text="Daily Digest — I liked this feature."
        surveySlug="feature_eval_w"
        questionSlug="goal7_feat_discover"
        type="title-medium"
      />,
    );

    userEvent.click(screen.getByRole('button', { name: 'View Daily Digest screenshots' }));

    expect(screen.getByRole('dialog', { name: 'Daily Digest' })).toBeInTheDocument();
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show previous screenshot' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Show next screenshot' })).toBeEnabled();
  });
});
