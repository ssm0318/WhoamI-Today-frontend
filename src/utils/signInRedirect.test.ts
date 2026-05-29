/* eslint-env jest */

import { getSafeSignInNext } from './signInRedirect';

describe('getSafeSignInNext', () => {
  it('allows internal app paths', () => {
    expect(getSafeSignInNext('/study?tab=surveys')).toBe('/study?tab=surveys');
  });

  it('rejects external or protocol-relative redirects', () => {
    expect(getSafeSignInNext('https://example.com/study')).toBeNull();
    expect(getSafeSignInNext('//example.com/study')).toBeNull();
  });
});
