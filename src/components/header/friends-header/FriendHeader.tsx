import IconButton from '@components/_common/icon-button/IconButton';
import { Font, Layout, SvgIcon } from '@design-system';
import { Noti } from '../Header.styled';

function FriendsHeader() {
  return (
    <>
      <Layout.FlexRow>
        <Font.Display type="24_regular">Friends</Font.Display>
      </Layout.FlexRow>
      <Layout.FlexRow gap={8}>
        <IconButton name="top_navigation_friend" size={44} />
        <Noti to="/notifications">
          <SvgIcon name="top_navigation_noti" size={44} />
          {/* TODO 넛지 변경 */}
          {/* {myProfile?.unread_noti && <IconNudge />} */}
        </Noti>
      </Layout.FlexRow>
    </>
  );
}

export default FriendsHeader;
