import MarkdownToJsx from 'markdown-to-jsx';
import styled from 'styled-components';

import { Colors, Layout } from '@design-system';

// Lightweight markdown wrapper for survey content. Used by:
//   - DisplayOnlyBlock (the question's `content` field)
//   - SurveyAnswerForm question description
//   - SurveyAnswerForm min_length_warning
//
// Inherits the parent's text color and font; only opinionated bits are
// paragraph spacing and link color (which we lock to PRIMARY).

const Wrapper = styled(Layout.FlexCol)`
  width: 100%;
  font-size: 16px;
  line-height: 1.5;

  & > p {
    margin: 0;
  }
  & > p + p {
    margin-top: 8px;
  }
  & a {
    color: ${Colors.PRIMARY};
  }
  & strong {
    font-weight: 700;
  }
  & em {
    font-style: italic;
  }
`;

interface MarkdownProps {
  source: string;
  className?: string;
}

export function Markdown({ source, className }: MarkdownProps) {
  return (
    <Wrapper className={className}>
      <MarkdownToJsx options={{ forceBlock: true }}>{source}</MarkdownToJsx>
    </Wrapper>
  );
}
