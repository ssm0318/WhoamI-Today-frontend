import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ValidatedInput from '@components/_common/validated-input/ValidatedInput';
import { Button, Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { validateUsername } from '@utils/apis/user';
import { AUTH_BUTTON_WIDTH } from 'src/design-system/Button/Button.types';

function UserName() {
  const [t] = useTranslation('translation', { keyPrefix: 'sign_up' });

  const [usernameInput, setUsernameInput] = useState('');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const setSignUpInfo = useBoundStore((state) => state.setSignUpInfo);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsernameInput(e.target.value);
    if (usernameError) setUsernameError(null);
  };

  const navigate = useNavigate();
  const onClickNext = () => {
    validateUsername({
      username: usernameInput,
      onSuccess: () => {
        setSignUpInfo({ username: usernameInput });
        navigate('/signup/profile-image');
      },
      onError: (e) => setUsernameError(e),
    });
  };

  return (
    <>
      <ValidatedInput
        label={t('username')}
        name="username"
        type="name"
        value={usernameInput}
        onChange={handleChange}
        error={usernameError}
      />
      <Layout.Fixed l={0} b="50px" w="100%" alignItems="center">
        <Button.Large
          type="filled"
          status={!usernameInput || usernameError ? 'disabled' : 'normal'}
          width={AUTH_BUTTON_WIDTH}
          text={t('next')}
          onClick={onClickNext}
        />
      </Layout.Fixed>
    </>
  );
}

export default UserName;
