import { useTranslation } from 'react-i18next';
import { Layout, SvgIcon, Typo } from '@design-system';

function PersonaPlaceholder() {
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
      <Typo type="label-medium" color="BLACK">
        {t('settings.edit_profile.placeholders.persona.my')}
      </Typo>
      <Typo type="label-medium" color="PRIMARY">
        {t('settings.edit_profile.placeholders.persona.WIT')}
      </Typo>
      <Typo type="label-medium" color="BLACK">
        {t('settings.edit_profile.placeholders.persona.persona')} 🤔
      </Typo>
    </Layout.FlexRow>
  );
}

export default PersonaPlaceholder;
