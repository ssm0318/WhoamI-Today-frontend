import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Layout } from '@design-system';
import CommonInput from 'src/design-system/Inputs/Input.styled';

function Email() {
  const [t] = useTranslation('translation', { keyPrefix: 'sign_up' });

  const navigate = useNavigate();
  const onClickNext = () => {
    navigate('/signup/password');
  };

  return (
    <>
      <CommonInput name="email" placeholder={t('email') || ''} type="email" />
      <Layout.Absolute w="100%" b="50px" flexDirection="column">
        <Button.Large
          type="filled"
          status="normal"
          sizing="stretch"
          text={t('next')}
          onClick={onClickNext}
        />
      </Layout.Absolute>
    </>
  );
}

export default Email;
