import React from 'react';
import { useTranslation } from 'react-i18next';
import { Font, Layout, SvgIcon } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { MomentData } from '@models/moment';
import { BoundState, useBoundStore } from '@stores/useBoundStore';
import { IconWrapper } from './TodaysMoments.styled';

const momentSelector = (state: BoundState) => ({
  moment: state.moment,
  fetch: state.fetch,
});

function TodaysMoments() {
  const [t] = useTranslation('translation', { keyPrefix: 'home.moment' });
  const { fetch } = useBoundStore(momentSelector);

  useAsyncEffect(async () => {
    await fetch();
  }, []);

  return (
    <Layout.FlexCol w="100%" bgColor="BACKGROUND_COLOR" ph="default" pt={22} pb={43}>
      {/* 타이틀 */}
      <Layout.FlexRow w="100%" justifyContent="center" alignItems="center">
        <Font.Display type="18_bold">{t('todays_moments')}</Font.Display>
      </Layout.FlexRow>
      {/* 컨텐츠 */}
      <IconWrapper w="100%" justifyContent="center" mt={32}>
        <MomentIcon name="mood" />
        <MomentIcon name="photo" />
        <MomentIcon name="description" />
      </IconWrapper>
    </Layout.FlexCol>
  );
}

function MomentIcon({ name }: { name: keyof MomentData }) {
  const sendMessageToApp = usePostAppMessage();
  const { moment } = useBoundStore(momentSelector);

  const handleClickUploadMoment = () => {
    if (moment[name]) return;
    // TODO 나중에 무조건 앱으로 보내는게 아니고, 웹에서의 핸들이 필요할 수도 있음
    sendMessageToApp('NAVIGATE', {
      screenName: 'MomentUploadScreen',
      params: {
        step: name,
        state: moment,
      },
    });
  };

  return (
    <button type="button" onClick={handleClickUploadMoment} disabled={!!moment[name]}>
      <SvgIcon
        name={moment[name] ? `moment_${name}_disabled` : `moment_${name}_normal`}
        size={46}
      />
    </button>
  );
}

export default React.memo(TodaysMoments);
