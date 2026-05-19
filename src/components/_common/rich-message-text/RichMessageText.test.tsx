/* eslint-env jest */

import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';

import { openExternalLink } from '@utils/openExternalLink';

import RichMessageText, { parseRichMessage } from './RichMessageText';

jest.mock(
  '@utils/openExternalLink',
  () => ({
    openExternalLink: jest.fn(),
  }),
  { virtual: true },
);

jest.mock('@utils/isInternalAppUrl', () => jest.requireActual('../../../utils/isInternalAppUrl'), {
  virtual: true,
});

function LocationProbe() {
  const location = useLocation();
  return (
    <span data-testid="location">{`${location.pathname}${location.search}${location.hash}`}</span>
  );
}

describe('parseRichMessage', () => {
  it('tokenizes minimal markdown links and bold text', () => {
    expect(parseRichMessage('Try **bold** then [survey](/surveys/demo/answer).')).toEqual([
      { kind: 'text', value: 'Try ' },
      { kind: 'bold', value: 'bold' },
      { kind: 'text', value: ' then ' },
      { kind: 'link', text: 'survey', url: '/surveys/demo/answer' },
      { kind: 'text', value: '.' },
    ]);
  });
});

describe('RichMessageText', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('navigates internally for markdown links to app URLs', () => {
    render(
      <MemoryRouter initialEntries={['/chat']}>
        <RichMessageText>
          Open [survey](http://localhost:3001/surveys/demo/answer?step=1#review)
        </RichMessageText>
        <LocationProbe />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'survey' }));

    expect(screen.getByTestId('location')).toHaveTextContent('/surveys/demo/answer?step=1#review');
    expect(openExternalLink).not.toHaveBeenCalled();
  });

  it('opens external markdown links outside the app', () => {
    render(
      <MemoryRouter>
        <RichMessageText>Open [docs](https://example.com/docs).</RichMessageText>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'docs' }));

    expect(openExternalLink).toHaveBeenCalledWith('https://example.com/docs');
  });

  it('keeps bare URL linkification behavior for plain text regions', () => {
    render(
      <MemoryRouter>
        <RichMessageText>Read https://example.com/plain</RichMessageText>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'https://example.com/plain' }));

    expect(openExternalLink).toHaveBeenCalledWith('https://example.com/plain');
  });
});
