import { useTranslation } from 'react-i18next';
import Icon from '../icon/Icon';
import MainHeader from '../MainHeader';

function ChatsHeader() {
  const [t] = useTranslation('translation', { keyPrefix: 'nav_tab' });
  return (
    <MainHeader
      title={t('chats')}
      rightButtons={
        <>
          <Icon name="new_chat" size={44} />
          <Icon name="dots_menu" size={44} />
        </>
      }
    />
  );
}

export default ChatsHeader;
