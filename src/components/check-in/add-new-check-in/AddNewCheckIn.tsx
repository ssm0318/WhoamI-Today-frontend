import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Font, Layout, SvgIcon } from '@design-system';

function AddNewCheckIn() {
  const [t] = useTranslation('translation', { keyPrefix: 'user_page.check_in' });
  const navigate = useNavigate();

  const handleClickAdd = () => {
    return navigate('/check-in/edit');
  };

  return (
    <Layout.FlexRow gap={8} w="100%" alignItems="center" justifyContent="center">
      <SvgIcon name="add_default" size={24} onClick={handleClickAdd} />
      <Font.Body type="12_regular">{t('new_check_in')}</Font.Body>
    </Layout.FlexRow>
  );
}

export default AddNewCheckIn;
