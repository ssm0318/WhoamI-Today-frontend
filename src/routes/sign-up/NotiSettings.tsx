import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FEED_DEFAULT_REDIRECTION_PATH, FRIEND_DEFAULT_REDIRECTION_PATH } from '@constants/url';
import { Button, Font, Layout } from '@design-system';
import { hasMandatorySignUpParams } from '@models/api/user';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { signUp } from '@utils/apis/user';
import { requestPermission } from '@utils/firebaseHelpers';
import { getMobileDeviceInfo } from '@utils/getUserAgent';
import { AUTH_BUTTON_WIDTH } from 'src/design-system/Button/Button.types';

function NotiSettings() {
  const [t] = useTranslation('translation', { keyPrefix: 'sign_up' });

  const [signUpInfo, resetSignUpInfo] = useBoundStore((state) => [
    state.signUpInfo,
    state.resetSignUpInfo,
  ]);

  const [dailyNotiOn, setDailyNotiOn] = useState(false);
  const [notiTime, setNotiTime] = useState<string>('');

  const { featureFlags } = useBoundStore(UserSelector);

  const { isMobile } = getMobileDeviceInfo();

  const onClickNotiOn = async () => {
    setDailyNotiOn(true);
    if (isMobile) {
      // TODO: 모바일 기기의 노티 켜기
      return;
    }
    await requestPermission();
  };

  const onChangeNotiTime = (e: ChangeEvent<HTMLInputElement>) => {
    const hour = e.target.value.split(':')[0];
    // NOTE: 시간 단위로만 설정 https://github.com/GooJinSun/WhoAmI-Today-frontend/issues/86#issuecomment-1712446149
    setNotiTime(`${hour}:00`);
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
        navigate(
          featureFlags?.friendList
            ? FRIEND_DEFAULT_REDIRECTION_PATH
            : FEED_DEFAULT_REDIRECTION_PATH,
        );
      },
      onError: (e) => {
        // TODO
        console.log(e);
      },
    });
  };

  return (
    <>
      {dailyNotiOn ? (
        <>
          <Font.Body type="18_regular" color="BLACK">
            {t('noti_time_setting_desc_1')}
            <br />
            {t('noti_time_setting_desc_2')}
          </Font.Body>
          <input type="time" value={notiTime} onChange={onChangeNotiTime} step={3600} />
        </>
      ) : (
        <Font.Body type="18_regular" color="BLACK">
          {t('noti_on_desc')}
        </Font.Body>
      )}
      <Layout.Fixed l={0} b="50px" w="100%" alignItems="center" gap={24} ph={24}>
        {dailyNotiOn ? (
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
