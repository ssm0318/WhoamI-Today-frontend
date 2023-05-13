import { useTranslation } from 'react-i18next';
import { Font, Layout, SvgIcon } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import { MomentData } from '@models/moment';
import { BoundState, useBoundStore } from '@stores/useBoundStore';
import { IconWrapper } from './TodaysMoments.styled';

const momentSelector = (state: BoundState) => ({
  mood: state.mood,
  description: state.description,
  photo: state.photo,
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
        <MomentIcon name="mood" state={moment} />
        <MomentIcon name="photo" state={moment} />
        <MomentIcon name="description" state={moment} />
      </IconWrapper>
    </Layout.FlexCol>
  );
}

function MomentIcon({ name, state }: { name: keyof MomentData; state: MomentData }) {
  const momentState = state[name];
  const sendMessageToApp = usePostAppMessage();

  const handleClickUploadMoment = () => {
    if (momentState) return;
    sendMessageToApp('NAVIGATE', {
      screenName: 'MomentUploadScreen',
      params: {
        step: name,
        state,
      },
    });
  };
  return (
    <button type="button" onClick={handleClickUploadMoment} disabled={!!momentState}>
      <SvgIcon name={momentState ? `moment_${name}_disabled` : `moment_${name}_normal`} size={46} />
    </button>
  );
}

export default TodaysMoments;
