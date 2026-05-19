/* eslint-env jest */

import { render, screen, waitFor } from '@testing-library/react';
import { useEffect, useRef } from 'react';

import { putSurveyDraftKeepalive } from '@utils/apis/survey';

import {
  mergeDraftPayloads,
  readSurveyDraftPayload,
  useSurveyDraft,
  writeSurveyDraftPayload,
} from './useSurveyDraft';

jest.mock(
  '@stores/useBoundStore',
  () => ({
    useBoundStore: (selector: (state: { myProfile: { id: number } }) => unknown) =>
      selector({ myProfile: { id: 7 } }),
  }),
  { virtual: true },
);

jest.mock(
  '@utils/apis/survey',
  () => ({
    putSurveyDraftKeepalive: jest.fn(),
  }),
  { virtual: true },
);

describe('survey draft storage', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('round-trips answers with progress metadata', () => {
    writeSurveyDraftPayload('draft-key', {
      answers: { 11: 4 },
      currentPageIndex: 1,
      totalPages: 4,
      answeredPages: 2,
      progressPct: 50,
      savedAt: '2026-05-18T10:00:00.000Z',
    });

    expect(readSurveyDraftPayload('draft-key')).toEqual({
      answers: { 11: 4 },
      currentPageIndex: 1,
      totalPages: 4,
      answeredPages: 2,
      progressPct: 50,
      savedAt: '2026-05-18T10:00:00.000Z',
    });
  });

  it('chooses the newest draft between localStorage and backend recovery', () => {
    const local = {
      answers: { 11: 2 },
      currentPageIndex: 0,
      totalPages: 2,
      answeredPages: 1,
      progressPct: 50,
      savedAt: '2026-05-18T10:00:00.000Z',
    };
    const backend = {
      answers: { 11: 4 },
      current_page_index: 1,
      total_pages: 2,
      answered_pages: 2,
      progress_pct: 100,
      saved_at: '2026-05-18T10:05:00.000Z',
    };

    expect(mergeDraftPayloads(local, backend)).toEqual({
      answers: { 11: 4 },
      currentPageIndex: 1,
      totalPages: 2,
      answeredPages: 2,
      progressPct: 100,
      savedAt: '2026-05-18T10:05:00.000Z',
    });
    expect(mergeDraftPayloads({ ...local, savedAt: '2026-05-18T10:10:00.000Z' }, backend)).toEqual({
      ...local,
      savedAt: '2026-05-18T10:10:00.000Z',
    });
  });
});

function DraftHarness() {
  const didWrite = useRef(false);
  const { hydrated, setAnswer, updateProgressMetadata } = useSurveyDraft('daily_base', null);

  useEffect(() => {
    if (!hydrated || didWrite.current) return;
    didWrite.current = true;
    setAnswer(11, 4);
    updateProgressMetadata({
      currentPageIndex: 0,
      totalPages: 2,
      answeredPages: 1,
      progressPct: 50,
    });
  }, [hydrated, setAnswer, updateProgressMetadata]);

  return <span>{hydrated ? 'ready' : 'loading'}</span>;
}

describe('useSurveyDraft lifecycle backup', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('backs up the latest local draft on pagehide without awaiting the network', async () => {
    render(<DraftHarness />);

    await screen.findByText('ready');
    await waitFor(() => {
      expect(readSurveyDraftPayload('whoami_survey_draft_7_daily_base').answers).toEqual({ 11: 4 });
    });

    window.dispatchEvent(new Event('pagehide'));

    expect(putSurveyDraftKeepalive).toHaveBeenCalledWith('daily_base', {
      answers: { 11: 4 },
      current_page_index: 0,
      total_pages: 2,
      answered_pages: 1,
      progress_pct: 50,
    });
  });
});
