import styled from 'styled-components';

import { Colors, Layout } from '@design-system';

// Pre-launch banner shown at the top of every survey page (answer + results)
// while the study isn't live yet. Removed once the real study schedule
// replaces the mock dailies on May 4 onward.
const Banner = styled(Layout.FlexCol)`
  width: 100%;
  border: 1px solid ${Colors.WARNING};
  border-radius: 12px;
  background: ${Colors.WHITE};
  padding: 12px 16px;
  color: ${Colors.WARNING};
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
`;

export function TestingDisclaimer() {
  return (
    <Banner role="note">
      These are not actual surveys for our study. Just testing things at the moment. Thanks for your
      patience!
    </Banner>
  );
}
