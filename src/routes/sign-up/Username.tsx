import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ValidatedInput from '@components/_common/validated-input/ValidatedInput';
import { Button, Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { validateUsername } from '@utils/apis/user';
import { AUTH_BUTTON_WIDTH } from 'src/design-system/Button/Button.types';

const USERNAME_MIN_LENGTH = 3;
const USERNAME_FORMAT_REGEX = /^[a-zA-Z0-9_@-]+$/;

function Username() {
  const [t] = useTranslation('translation', { keyPrefix: 'sign_up' });
  const { setSignUpInfo, signUpInfo } = useBoundStore((state) => ({
    setSignUpInfo: state.setSignUpInfo,
    signUpInfo: state.signUpInfo,
  }));
  const [usernameInput, setUsernameInput] = useState(signUpInfo.username || '');
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsernameInput(e.target.value);
    if (usernameError) setUsernameError(null);
  };

  const onClickNext = () => {
    const trimmed = usernameInput.trim();

    if (trimmed.length < USERNAME_MIN_LENGTH) {
      setUsernameError(t('username_min_length_error'));
      return;
    }
    if (!USERNAME_FORMAT_REGEX.test(trimmed)) {
      setUsernameError(t('username_format_error'));
      return;
    }

    validateUsername({
      username: trimmed,
      onSuccess: () => {
        setSignUpInfo({ username: trimmed });
        navigate('/signup/info');
      },
      onError: (e) => setUsernameError(e),
    });
  };

  return (
    <>
      <ValidatedInput
        label={t('username')}
        name="username"
        type="text"
        value={usernameInput}
        onChange={handleChange}
        error={usernameError}
        guide={t('username_guide')}
      />
      <Layout.Fixed l={0} b="50px" w="100%" alignItems="center">
        <Button.Large
          type="gray_fill"
          status={!usernameInput || usernameError ? 'disabled' : 'normal'}
          width={AUTH_BUTTON_WIDTH}
          text={t('next')}
          onClick={onClickNext}
        />
      </Layout.Fixed>
    </>
  );
}

export default Username;
