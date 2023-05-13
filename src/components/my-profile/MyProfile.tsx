import { Font, Layout, SvgIcon } from '@design-system';

function MyProfile() {
  // TODO: 유저 정보 불러오기
  return (
    <Layout.FlexRow alignItems="center" h={36}>
      <SvgIcon name="my_profile" size={36} />
      <Layout.FlexRow alignItems="center" pl={8}>
        <Font.Body type="18_regular" color="GRAY_4">
          User Name
        </Font.Body>
      </Layout.FlexRow>
    </Layout.FlexRow>
  );
}

export default MyProfile;
