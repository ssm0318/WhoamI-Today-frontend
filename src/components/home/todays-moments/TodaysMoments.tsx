import { useTranslation } from 'react-i18next';
import { Font, Layout, SvgIcon } from '@design-system';
import { IconWrapper } from './TodaysMoments.styled';

function TodaysMoments() {
  const [t] = useTranslation('translation', { keyPrefix: 'home.moment' });

  return (
    <Layout.FlexCol w="100%" bgColor="BACKGROUND_COLOR" ph="default" pt={22} pb={43}>
      {/* 타이틀 */}
      <Layout.FlexRow w="100%" justifyContent="center" alignItems="center">
        <Font.Display type="18_bold">{`${t('todays_moments')}`}</Font.Display>
      </Layout.FlexRow>
      {/* 컨텐츠 */}
      <IconWrapper w="100%" justifyContent="center" mt={32}>
        <SvgIcon name="moment_emoji_normal" size={46} />
        <SvgIcon name="moment_photo_normal" size={46} />
        <SvgIcon name="moment_pencil_normal" size={46} />
      </IconWrapper>
    </Layout.FlexCol>
  );
}

export default TodaysMoments;
