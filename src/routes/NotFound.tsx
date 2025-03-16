import { useTranslation } from 'react-i18next';
import SubHeader from '@components/sub-header/SubHeader';
import { BOTTOM_TABBAR_HEIGHT } from '@constants/layout';
import { Button, Font, Layout } from '@design-system';

export function NotFound() {
  const [t] = useTranslation('translation', { keyPrefix: 'not_found_page' });
  return (
    <>
      <SubHeader />
      <Layout.FlexCol
        w="100%"
        h="100%"
        alignItems="center"
        justifyContent="center"
        mb={BOTTOM_TABBAR_HEIGHT}
        gap={10}
      >
        <Font.Typo type="title-large" color="DARK_GRAY">
          {t('title')}
        </Font.Typo>
        <Button.Tertiary to="/" text={t('go_home')} status="normal" />
      </Layout.FlexCol>
    </>
  );
}
