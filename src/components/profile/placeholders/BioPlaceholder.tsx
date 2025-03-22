import { useTranslation } from 'react-i18next';
import { Layout, Typo } from '@design-system';

function BioPlaceholder() {
  const [t] = useTranslation('translation');

  return (
    <Layout.FlexRow
      style={{
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 8,
      }}
      outline="MEDIUM_GRAY"
      bgColor="LIGHT"
      pv={2}
      ph={12}
    >
      <Typo type="label-medium" color="MEDIUM_GRAY">
        {t('settings.edit_profile.bio')}
      </Typo>
    </Layout.FlexRow>
  );
}

export default BioPlaceholder;
