import Linkify from 'linkify-react';
import { IntermediateRepresentation, Opts } from 'linkifyjs';
import { MouseEvent, ReactNode } from 'react';
import { openExternalLink } from '@utils/openExternalLink';
import StyledLink from './LinkifiedText.styled';

interface LinkifiedTextProps {
  children: ReactNode;
}

const renderLink = ({ attributes, content }: IntermediateRepresentation) => {
  const { href } = attributes;
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    openExternalLink(href);
  };
  return (
    <StyledLink href={href} onClick={handleClick}>
      {content}
    </StyledLink>
  );
};

const linkifyOptions: Opts = {
  render: renderLink,
  defaultProtocol: 'https',
  target: '_blank',
  rel: 'noopener noreferrer',
};

function LinkifiedText({ children }: LinkifiedTextProps) {
  return <Linkify options={linkifyOptions}>{children}</Linkify>;
}

export default LinkifiedText;
