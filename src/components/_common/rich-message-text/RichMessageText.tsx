import Linkify from 'linkify-react';
import { IntermediateRepresentation, Opts } from 'linkifyjs';
import { Fragment, MouseEvent, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseInternalAppUrl } from '@utils/isInternalAppUrl';
import { openExternalLink } from '@utils/openExternalLink';
import { Bold, InlineLink } from './RichMessageText.styled';

// Minimal markdown subset:
//   **bold**      -> <strong>
//   [label](url)  -> in-app or external link (URL hidden, only `label` shown)
// Bare URLs in plain-text regions still auto-linkify (preserves existing
// chat behavior). Nesting (e.g. bold inside link text) is not supported -
// the message author should write one or the other, not both.

interface RichMessageTextProps {
  children: string;
}

type Token =
  | { kind: 'text'; value: string }
  | { kind: 'bold'; value: string }
  | { kind: 'link'; text: string; url: string };

// Single regex with two alternations. Order matters: the link form is
// checked first so `[**foo**](url)` parses as a link (the bold inside is
// kept as the literal link text - fine, since we don't render nesting).
const MARKDOWN_PATTERN = /(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+?)\*\*)/g;

export function parseRichMessage(input: string): Token[] {
  const tokens: Token[] = [];
  let lastIndex = 0;
  const matches = Array.from(input.matchAll(MARKDOWN_PATTERN));
  matches.forEach((match) => {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      tokens.push({ kind: 'text', value: input.slice(lastIndex, start) });
    }
    if (match[1]) {
      tokens.push({ kind: 'link', text: match[2], url: match[3] });
    } else if (match[4]) {
      tokens.push({ kind: 'bold', value: match[5] });
    }
    lastIndex = start + match[0].length;
  });
  if (lastIndex < input.length) {
    tokens.push({ kind: 'text', value: input.slice(lastIndex) });
  }
  return tokens;
}

// Auto-linkify renderer used for bare URLs in plain-text regions. Same as
// LinkifiedText so chat keeps its existing behavior for URLs typed without
// markdown wrappers.
const renderAutoLink = ({ attributes, content }: IntermediateRepresentation) => {
  const { href } = attributes;
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    openExternalLink(href);
  };
  return (
    <InlineLink href={href} onClick={handleClick}>
      {content}
    </InlineLink>
  );
};

const linkifyOptions: Opts = {
  render: renderAutoLink,
  defaultProtocol: 'https',
  target: '_blank',
  rel: 'noopener noreferrer',
};

function RichMessageText({ children }: RichMessageTextProps) {
  const navigate = useNavigate();
  const tokens = parseRichMessage(children);

  return (
    <>
      {tokens.map((token, i): ReactNode => {
        // Index-keyed because tokens are recomputed on every render from
        // the same input string - order is stable.
        const key = `t${i}`;
        if (token.kind === 'text') {
          return (
            <Fragment key={key}>
              <Linkify options={linkifyOptions}>{token.value}</Linkify>
            </Fragment>
          );
        }
        if (token.kind === 'bold') {
          return <Bold key={key}>{token.value}</Bold>;
        }
        const internal = parseInternalAppUrl(token.url);
        const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
          e.preventDefault();
          e.stopPropagation();
          if (internal) {
            navigate(`${internal.pathname}${internal.search}${internal.hash}`);
          } else {
            openExternalLink(token.url);
          }
        };
        return (
          <InlineLink key={key} href={token.url} onClick={handleClick}>
            {token.text}
          </InlineLink>
        );
      })}
    </>
  );
}

export default RichMessageText;
