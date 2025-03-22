import { useTranslation } from 'react-i18next';
import { Layout, SvgIcon, Typo } from '@design-system';

function PronounPlaceholder() {
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
      pv={4}
      ph={12}
      gap={4}
    >
      <SvgIcon name="add_default" size={12} />

      <Typo type="label-medium" color="MEDIUM_GRAY">
        {t('settings.edit_profile.placeholders.pronoun')}
      </Typo>
    </Layout.FlexRow>
  );
}

export default PronounPlaceholder;
