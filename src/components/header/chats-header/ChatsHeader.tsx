import { Font, Layout, SvgIcon } from '@design-system';
import Icon from '../icon/Icon';

function ChatsHeader() {
  return (
    <>
      <Layout.FlexRow>
        <SvgIcon name="arrow_left" size={36} color="BASIC_BLACK" />
      </Layout.FlexRow>
      <Layout.FlexRow>
        <Font.Display type="24_regular">Chats</Font.Display>
      </Layout.FlexRow>
      <Layout.FlexRow gap={8} alignItems="center">
        <Icon name="new_chat" size={44} />
        <Icon name="dots_menu" size={44} />
      </Layout.FlexRow>
    </>
  );
}

export default ChatsHeader;
