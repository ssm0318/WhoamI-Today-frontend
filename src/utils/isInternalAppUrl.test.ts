/* eslint-env jest */

import { parseInternalAppUrl } from './isInternalAppUrl';

describe('parseInternalAppUrl', () => {
  it('extracts in-app route details from known app hosts', () => {
    expect(parseInternalAppUrl('https://whoami.gina-park.site/surveys/demo?step=1#review')).toEqual(
      {
        pathname: '/surveys/demo',
        search: '?step=1',
        hash: '#review',
      },
    );
  });

  it('treats root-relative paths as internal routes', () => {
    expect(parseInternalAppUrl('/surveys/demo?step=1#review')).toEqual({
      pathname: '/surveys/demo',
      search: '?step=1',
      hash: '#review',
    });
  });

  it('returns null for external hosts and non-path text', () => {
    expect(parseInternalAppUrl('https://example.com/surveys/demo')).toBeNull();
    expect(parseInternalAppUrl('surveys/demo')).toBeNull();
  });
});
