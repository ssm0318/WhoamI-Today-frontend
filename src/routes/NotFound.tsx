import { useTranslation } from 'react-i18next';
import SubHeader from '@components/sub-header/SubHeader';
import { BOTTOM_TABBAR_HEIGHT } from '@constants/layout';
import { Font, Layout } from '@design-system';

export function NotFound() {
  const [t] = useTranslation('translation', { keyPrefix: 'error' });
  return (
    <>
      <SubHeader />
      <Layout.FlexCol
        w="100%"
        h="100%"
        alignItems="center"
        justifyContent="center"
        mb={BOTTOM_TABBAR_HEIGHT}
      >
        <Font.Typo type="title-large" color="DARK_GRAY">
          {t('not_found')}
        </Font.Typo>
        {/** 홈으로 이동 */}
      </Layout.FlexCol>
    </>
  );
}
