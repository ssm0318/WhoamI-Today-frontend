import styled from 'styled-components';

const StyledLink = styled.a`
  color: ${({ theme }) => theme.PRIMARY};
  text-decoration: underline;
  word-break: break-all;
  cursor: pointer;
`;

export default StyledLink;
