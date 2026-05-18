/* eslint-env jest */

import { renderToStaticMarkup } from 'react-dom/server';
import Reimbursement from './Reimbursement';

describe('Reimbursement', () => {
  it('shows the temporary under-construction message', () => {
    const markup = renderToStaticMarkup(<Reimbursement />);

    expect(markup).toContain('Page under construction');
    expect(markup).toContain('Please revisit this page later.');
  });
});
