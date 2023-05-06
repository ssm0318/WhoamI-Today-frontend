import LinkButton from '@components/_common/buttons/LinkButton';
import { FlexStackWrapper, IntroWrapper } from '@styles/wrappers.styled';

function Intro() {
  return (
    <IntroWrapper>
      <FlexStackWrapper>
        <LinkButton to="/signup" type="primary">
          Sign Up{' '}
        </LinkButton>
        <LinkButton to="/signin" type="primary">
          Sign In
        </LinkButton>
      </FlexStackWrapper>
    </IntroWrapper>
  );
}

export default Intro;
