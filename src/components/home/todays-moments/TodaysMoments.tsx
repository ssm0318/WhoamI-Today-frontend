import { useTranslation } from 'react-i18next';
import { Font, Layout, SvgIcon } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import { MomentData } from '@models/moment';
import { BoundState, useBoundStore } from '@stores/useBoundStore';
import { IconWrapper } from './TodaysMoments.styled';

const momentSelector = (state: Pick<BoundState, 'mood' | 'photo' | 'description'>) => ({
  ...state,
});

function TodaysMoments() {
  const moment = useBoundStore(momentSelector);

  const [t] = useTranslation('translation', { keyPrefix: 'home.moment' });

  return (
    <Layout.FlexCol w="100%" bgColor="BACKGROUND_COLOR" ph="default" pt={22} pb={43}>
      {/* 타이틀 */}
      <Layout.FlexRow w="100%" justifyContent="center" alignItems="center">
        <Font.Display type="18_bold">{`${t('todays_moments')}`}</Font.Display>
      </Layout.FlexRow>
      {/* 컨텐츠 */}
      <IconWrapper w="100%" justifyContent="center" mt={32}>
        <MomentIcon key="mood" state={moment} />
        <MomentIcon key="photo" state={moment} />
        <MomentIcon key="description" state={moment} />
      </IconWrapper>
    </Layout.FlexCol>
  );
}

function MomentIcon({ key, state }: { key: keyof MomentData; state: MomentData }) {
  const sendMessageToApp = usePostAppMessage();

  const handleClickUploadMoment = () => {
    sendMessageToApp('NAVIGATE', {
      screenName: 'MomentUploadScreen',
      params: {
        step: key,
        state,
      },
    });
  };
  return (
    <button type="button" onClick={handleClickUploadMoment}>
      <SvgIcon name={state[key] ? 'moment_emoji_disabled' : 'moment_emoji_normal'} size={46} />
    </button>
  );
}

export default TodaysMoments;
