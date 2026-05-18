/* eslint-env jest */

import { renderToStaticMarkup } from 'react-dom/server';
import Header from './Header';

let mockPathname = '/';

jest.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: mockPathname }),
  useNavigate: () => jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => [
    (key: string) => {
      if (key === 'header.reimbursement') return 'Reimbursement';
      return key;
    },
  ],
}));

jest.mock(
  '@components/_common/icon/Icon',
  () =>
    function MockIcon() {
      return <button type="button">icon</button>;
    },
  { virtual: true },
);

jest.mock(
  '@components/sub-header/SubHeader',
  () =>
    function MockSubHeader({ title }: { title: string }) {
      return <header>{title}</header>;
    },
  { virtual: true },
);

jest.mock(
  '@models/api/user',
  () => ({
    VersionType: {
      VER_W: 'w',
      VER_Q: 'q',
    },
  }),
  { virtual: true },
);

jest.mock(
  '@stores/useBoundStore',
  () => ({
    useBoundStore: (selector: (state: unknown) => unknown) =>
      selector({
        myProfile: null,
      }),
  }),
  { virtual: true },
);

jest.mock('./common-header/CommonHeader', () => {
  return function MockCommonHeader({ title }: { title: string }) {
    return <header data-testid="common-header">{title}</header>;
  };
});

jest.mock('./friends-header/FriendsHeader', () => {
  return function MockFriendsHeader() {
    return <header>Friends</header>;
  };
});

describe('Header', () => {
  it('renders app navigation on the reimbursement route', () => {
    mockPathname = '/reimbursement';

    const markup = renderToStaticMarkup(<Header />);

    expect(markup).toContain('data-testid="common-header"');
    expect(markup).toContain('Reimbursement');
  });
});
