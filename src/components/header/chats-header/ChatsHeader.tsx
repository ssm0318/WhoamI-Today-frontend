import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Font, Layout, SvgIcon } from '@design-system';
import Icon from '../icon/Icon';
import { RightIconArea } from './ChatsHeader.styled';

function ChatsHeader() {
  const [t] = useTranslation('translation', { keyPrefix: 'chats' });
  const navigate = useNavigate();

  const handleClickGoBack = () => {
    navigate(-1);
  };

  const handleClickCreateChatRoom = () => {
    // TODO: 채팅방 생성
  };

  const handleClickMenu = () => {
    // TODO: 채팅탭 메뉴
  };

  return (
    <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
      <SvgIcon name="arrow_left" size={36} color="BASIC_BLACK" onClick={handleClickGoBack} />
      <Font.Display type="24_regular">{t('title')}</Font.Display>
      <RightIconArea>
        <Icon name="top_navigation_dots" size={20} onClick={handleClickMenu} />
        <Layout.Absolute l={-50}>
          <Icon name="top_navigation_edit" size={44} onClick={handleClickCreateChatRoom} />
        </Layout.Absolute>
      </RightIconArea>
    </Layout.FlexRow>
  );
}

export default ChatsHeader;
