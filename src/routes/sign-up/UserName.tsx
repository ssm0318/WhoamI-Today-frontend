import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ValidatedInput from '@components/_common/validated-input/ValidatedInput';
import { Button, Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { validateUsername } from '@utils/apis/user';

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
        name="username"
        placeholder={t('username') || ''}
        type="name"
        value={usernameInput}
        onChange={handleChange}
        error={usernameError}
      />
      <Layout.Absolute w="100%" b="50px" flexDirection="column">
        <Button.Large
          type="filled"
          status={!usernameInput || usernameError ? 'disabled' : 'normal'}
          sizing="stretch"
          text={t('next')}
          onClick={onClickNext}
        />
      </Layout.Absolute>
    </>
  );
}

export default UserName;
