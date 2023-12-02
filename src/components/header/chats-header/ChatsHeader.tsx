import { useTranslation } from 'react-i18next';
import HeaderContainer from '../HeaderContainer';
import Icon from '../icon/Icon';

function ChatsHeader() {
  const [t] = useTranslation('translation', { keyPrefix: 'nav_tab' });
  return (
    <HeaderContainer
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
