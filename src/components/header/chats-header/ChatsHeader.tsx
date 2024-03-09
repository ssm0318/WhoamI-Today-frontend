import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import MainHeader from '../MainHeader';

function ChatsHeader() {
  const [t] = useTranslation('translation', { keyPrefix: 'nav_tab' });

  const navigate = useNavigate();

  const handleClickEditList = () => {
    navigate('/chats/edit');
  };

  return (
    <MainHeader
      title={t('chats')}
      rightButtons={<Icon name="edit_list" size={44} onClick={handleClickEditList} />}
    />
  );
}

export default ChatsHeader;
