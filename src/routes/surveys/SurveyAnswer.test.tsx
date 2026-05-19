/* eslint-env jest */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import useSWR, { mutate } from 'swr';

import { getSurveyIndex } from '@utils/apis/survey';

import SurveyAnswer from './SurveyAnswer';

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useLocation: () => ({ state: { from: '/surveys' } }),
  useNavigate: () => mockedNavigate,
  useParams: () => ({ slug: 'phase1_friend_closeness' }),
}));

jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
  mutate: jest.fn(),
}));

jest.mock(
  '@components/sub-header/SubHeader',
  () => ({
    __esModule: true,
    default: ({ title }: { title: string }) => <div>{title}</div>,
  }),
  { virtual: true },
);

jest.mock(
  '@components/survey/SurveyAnswerForm',
  () => ({
    SurveyAnswerForm: ({
      onSubmitted,
    }: {
      onSubmitted: (result: { id: number; point_award: null }) => void;
    }) => (
      <button type="button" onClick={() => onSubmitted({ id: 1, point_award: null })}>
        submit mock
      </button>
    ),
  }),
  { virtual: true },
);

jest.mock(
  '@design-system',
  () => {
    const React = jest.requireActual<typeof import('react')>('react');
    function MockLayout({ children, ...props }: { children?: ReactNode }) {
      return React.createElement('div', props, children);
    }
    function MockTypo({ children }: { children?: ReactNode }) {
      return React.createElement('span', null, children);
    }

    return {
      Colors: {
        DARK_GRAY: '#555',
        LIGHT_GRAY: '#ddd',
        WHITE: '#fff',
      },
      Layout: {
        FlexCol: MockLayout,
      },
      Typo: MockTypo,
    };
  },
  { virtual: true },
);

jest.mock(
  '@i18n/index',
  () => ({
    __esModule: true,
    default: { language: 'en' },
  }),
  { virtual: true },
);

jest.mock(
  '@stores/useBoundStore',
  () => ({
    useBoundStore: () => jest.fn(),
  }),
  { virtual: true },
);

jest.mock(
  '@utils/apis/reimbursement',
  () => ({
    REIMBURSEMENT_KEY: '/surveys/reimbursement/',
  }),
  { virtual: true },
);

jest.mock(
  '@hooks/useSurveyOfTheDay',
  () => ({
    SURVEY_OF_THE_DAY_KEY: '/surveys/today/',
  }),
  { virtual: true },
);

jest.mock(
  '@utils/apis/survey',
  () => ({
    getSurveyDetail: jest.fn(),
    getSurveyIndex: jest.fn(),
  }),
  { virtual: true },
);

jest.mock('../Root', () => ({
  MainScrollContainer: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}));

jest.mock('./SurveyPageLayout', () => ({
  SurveyPageShell: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}));

const mockedUseSWR = useSWR as unknown as jest.Mock;
const mockedMutate = mutate as unknown as jest.Mock;
const mockedGetSurveyIndex = getSurveyIndex as jest.Mock;

describe('SurveyAnswer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseSWR.mockReturnValue({
      data: {
        slug: 'phase1_friend_closeness',
        title_en: 'Friend closeness',
        title_ko: 'Friend closeness',
        description_en: '',
        description_ko: '',
      },
    });
  });

  it('replaces the cached survey index after submit before leaving the answer page', async () => {
    const freshIndex = {
      available_now: [],
      late_but_accepted: [],
      completed: [
        {
          cadence: 'biweekly',
          sequence_index: 6,
          survey: { slug: 'phase1_friend_closeness' },
          user_answered: true,
        },
      ],
    };
    mockedGetSurveyIndex.mockResolvedValue(freshIndex);

    render(<SurveyAnswer />);
    fireEvent.click(screen.getByText('submit mock'));

    await waitFor(() => {
      expect(mockedMutate).toHaveBeenCalledWith('/surveys/index/', freshIndex, {
        revalidate: false,
      });
    });
    expect(mockedNavigate).toHaveBeenCalledWith('/surveys/phase1_friend_closeness/done', {
      replace: true,
      state: { from: '/surveys', point_award: null },
    });
  });
});
