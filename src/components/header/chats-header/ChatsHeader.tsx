<<<<<<< HEAD
import { useTranslation } from 'react-i18next';
import Icon from '../icon/Icon';
import MainHeader from '../MainHeader';
=======
import IconButton from '@components/_common/icon-button/IconButton';
import { Font, Layout, SvgIcon } from '@design-system';
>>>>>>> 5497610 ((#220) 노트 마크업 (#223))

function ChatsHeader() {
  const [t] = useTranslation('translation', { keyPrefix: 'nav_tab' });
  return (
<<<<<<< HEAD
    <MainHeader
      title={t('chats')}
      rightButtons={
        <>
          <Icon name="new_chat" size={44} />
          <Icon name="dots_menu" size={44} />
        </>
      }
    />
=======
    <>
      <Layout.FlexRow>
        <SvgIcon name="arrow_left" size={36} color="BASIC_BLACK" />
      </Layout.FlexRow>
      <Layout.FlexRow>
        <Font.Display type="24_regular">Chats</Font.Display>
      </Layout.FlexRow>
      <Layout.FlexRow gap={8} alignItems="center">
        <IconButton name="top_navigation_edit" size={44} />
        <IconButton name="top_navigation_dots" size={20} />
      </Layout.FlexRow>
    </>
>>>>>>> 5497610 ((#220) 노트 마크업 (#223))
  );
}

export default ChatsHeader;
