import styled from 'styled-components';

export const InlineLink = styled.a`
  color: ${({ theme }) => theme.PRIMARY};
  text-decoration: underline;
  word-break: break-all;
  cursor: pointer;
`;

// styled-reset (loaded in global-styles) wipes the user-agent
// `font-weight: bold` off <strong>, so set it explicitly.
export const Bold = styled.strong`
  font-weight: 700;
`;
