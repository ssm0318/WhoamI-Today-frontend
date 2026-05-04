import styled from 'styled-components';

import { Colors, Layout } from '@design-system';

import { Markdown } from './Markdown';

// Banner-style block rendered for `display_only` questions. No input, no
// submission value — just a markdown body shown inline in the question
// flow. Survey YAML uses these for section headers, anchored block intros,
// and conditional explanations.
const Banner = styled(Layout.FlexCol)`
  width: 100%;
  border-radius: 12px;
  background: ${Colors.LIGHT};
  padding: 16px;
  color: ${Colors.BLACK};
`;

interface DisplayOnlyBlockProps {
  content: string;
}

export function DisplayOnlyBlock({ content }: DisplayOnlyBlockProps) {
  return (
    <Banner>
      <Markdown source={content} />
    </Banner>
  );
}
