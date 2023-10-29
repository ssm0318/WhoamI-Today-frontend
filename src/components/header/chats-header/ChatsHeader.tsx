import { Font, Layout, SvgIcon } from '@design-system';

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
        <SvgIcon name="top_navigation_edit" size={36} />
        <Layout.FlexRow w={36} h={36} alignItems="center" justifyContent="center">
          <SvgIcon name="top_navigation_dots" size={20} />
        </Layout.FlexRow>
      </Layout.FlexRow>
    </>
  );
}

export default ChatsHeader;
