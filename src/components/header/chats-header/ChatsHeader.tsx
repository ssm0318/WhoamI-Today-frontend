import { Font, Layout, SvgIcon } from '@design-system';
import Icon from '../icon/Icon';

function ChatsHeader() {
  return (
    <>
      <Layout.FlexRow>
        <SvgIcon name="arrow_left" size={36} color="BLACK" />
      </Layout.FlexRow>
      <Layout.FlexRow>
        <Font.Display type="24_regular">Chats</Font.Display>
      </Layout.FlexRow>
      <Layout.FlexRow gap={8} alignItems="center">
        <Icon name="top_navigation_edit" size={44} />
        <Icon name="top_navigation_dots" size={20} />
      </Layout.FlexRow>
    </>
  );
}

export default ChatsHeader;
