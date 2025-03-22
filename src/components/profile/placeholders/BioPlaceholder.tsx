import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Layout, SvgIcon, Typo } from '@design-system';

function BioPlaceholder() {
  const [t] = useTranslation('translation');
  const navigate = useNavigate();

  const handleClickAddBio = () => {
    return navigate('/settings/edit-profile');
  };

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
      onClick={handleClickAddBio}
    >
      <SvgIcon name="add_default" size={12} />
      <Typo type="label-medium" color="MEDIUM_GRAY">
        {t('settings.edit_profile.placeholders.bio')}
      </Typo>
    </Layout.FlexRow>
  );
}

export default BioPlaceholder;
