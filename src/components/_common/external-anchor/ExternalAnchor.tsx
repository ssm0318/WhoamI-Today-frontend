import { AnchorHTMLAttributes, ReactNode } from 'react';
import { openExternalLink } from '@utils/openExternalLink';
import StyledExternalAnchor from './ExteranlAnchor.styled';

interface ExternalAnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  link: string;
}

function ExternalAnchor(props: ExternalAnchorProps) {
  const { children, link, ...anchorProps } = props;

  const onClick = () => {
    openExternalLink(link);
  };
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <StyledExternalAnchor role="link" tabIndex={0} onClick={onClick} {...anchorProps}>
      {children}
    </StyledExternalAnchor>
  );
}

export default ExternalAnchor;
