import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_REDIRECTION_PATH } from '@constants/url';
import { Button, Font, Layout } from '@design-system';
import { hasMandatorySignUpParams } from '@models/api/user';
import { useBoundStore } from '@stores/useBoundStore';
import { signUp } from '@utils/apis/user';
import { requestPermission } from '@utils/firebaseHelpers';
import { getMobileDeviceInfo } from '@utils/getUserAgent';
import { AUTH_BUTTON_WIDTH } from 'src/design-system/Button/Button.types';

function NotiSettings() {
  const [t] = useTranslation('translation', { keyPrefix: 'sign_up' });

  const [signUpInfo, setSignUpInfo, resetSignUpInfo] = useBoundStore((state) => [
    state.signUpInfo,
    state.setSignUpInfo,
    state.resetSignUpInfo,
  ]);

  const [notiTime, setNotiTime] = useState<string>('');

  const { isMobile } = getMobileDeviceInfo();

  const onClickNotiOn = async () => {
    setSignUpInfo({ noti_on: true });

    if (isMobile) {
      // TODO: 모바일 기기의 노티 켜기
      return;
    }
    await requestPermission();
  };

  const onChangeNotiTime = (e: ChangeEvent<HTMLInputElement>) => {
    setNotiTime(e.target.value);
  };

  const navigate = useNavigate();
  const onClickNextOrSkip = () => {
    if (!hasMandatorySignUpParams(signUpInfo)) {
      navigate('/signup/email');
      // TOOO: 에러 메시지 보강
      return;
    }

    signUp({
      signUpInfo: {
        ...signUpInfo,
        ...(notiTime ? { noti_time: notiTime } : {}),
      },
      onSuccess: () => {
        resetSignUpInfo();
        navigate(DEFAULT_REDIRECTION_PATH);
      },
      onError: (e) => {
        // TODO
        console.log(e);
      },
    });
  };

  return (
    <>
      {signUpInfo.noti_on ? (
        <>
          <Font.Body type="18_regular" color="BLACK">
            {t('noti_time_setting_desc_1')}
            <br />
            {t('noti_time_setting_desc_2')}
          </Font.Body>
          <input type="time" value={notiTime} onChange={onChangeNotiTime} />
        </>
      ) : (
        <Font.Body type="18_regular" color="BLACK">
          {t('noti_on_desc')}
        </Font.Body>
      )}
      <Layout.Fixed l={0} b="50px" w="100%" alignItems="center" gap={24} ph={24}>
        {signUpInfo.noti_on ? (
          <>
            <Button.Large
              type="gray_fill"
              status="normal"
              width={AUTH_BUTTON_WIDTH}
              text={t('complete')}
              onClick={onClickNextOrSkip}
            />
            <Button.Large
              type="gray_fill"
              status="normal"
              width={AUTH_BUTTON_WIDTH}
              text={t('skip')}
              onClick={onClickNextOrSkip}
            />
            {!notiTime && <Font.Body type="18_regular">{t('noti_time_default_desc')}</Font.Body>}
          </>
        ) : (
          <>
            <Button.Large
              type="gray_fill"
              status="normal"
              width={AUTH_BUTTON_WIDTH}
              text={t('yes')}
              onClick={onClickNotiOn}
            />
            <Button.Large
              type="gray_fill"
              status="normal"
              width={AUTH_BUTTON_WIDTH}
              text={t('skip')}
              onClick={onClickNextOrSkip}
            />
          </>
        )}
      </Layout.Fixed>
    </>
  );
}

export default NotiSettings;
