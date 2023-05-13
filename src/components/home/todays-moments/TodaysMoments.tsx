import { useTranslation } from 'react-i18next';
import { Font, Layout, SvgIcon } from '@design-system';
import { BoundState, useBoundStore } from '@stores/useBoundStore';
import { IconWrapper } from './TodaysMoments.styled';

const momentSelector = (state: Pick<BoundState, 'mood' | 'photo' | 'description'>) => ({
  ...state,
});

function TodaysMoments() {
  const { mood, photo, description } = useBoundStore(momentSelector);

  const [t] = useTranslation('translation', { keyPrefix: 'home.moment' });

  return (
    <Layout.FlexCol w="100%" bgColor="BACKGROUND_COLOR" ph="default" pt={22} pb={43}>
      {/* 타이틀 */}
      <Layout.FlexRow w="100%" justifyContent="center" alignItems="center">
        <Font.Display type="18_bold">{`${t('todays_moments')}`}</Font.Display>
      </Layout.FlexRow>
      {/* 컨텐츠 */}
      <IconWrapper w="100%" justifyContent="center" mt={32}>
        <SvgIcon name={mood ? 'moment_emoji_disabled' : 'moment_emoji_normal'} size={46} />
        <SvgIcon name={photo ? 'moment_photo_disabled' : 'moment_photo_normal'} size={46} />
        <SvgIcon name={description ? 'moment_pencil_disabled' : 'moment_pencil_normal'} size={46} />
      </IconWrapper>
    </Layout.FlexCol>
  );
}

export default TodaysMoments;
