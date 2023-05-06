import { useTranslation } from 'react-i18next';
import { Button } from '@design-system';
import { FlexStackWrapper, IntroWrapper } from '@styles/wrappers.styled';

function Intro() {
  const [t] = useTranslation('translation', { keyPrefix: 'intro' });
  return (
    <IntroWrapper>
      <FlexStackWrapper>
        <Button.Large type="filled" status="normal" to="/signup" text={t('sign_up')} />
        <Button.Large type="filled" status="normal" to="/signin" text={t('sign_in')} />
      </FlexStackWrapper>
    </IntroWrapper>
  );
}

export default Intro;
