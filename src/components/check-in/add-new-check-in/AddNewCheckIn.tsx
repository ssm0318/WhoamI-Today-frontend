import { Font, Layout, SvgIcon } from '@design-system';

function AddNewCheckIn() {
  return (
    <Layout.FlexRow gap={8} w="100%" alignItems="center" justifyContent="center">
      <SvgIcon name="add_default" size={24} />
      <Font.Body type="12_regular">New Check-in</Font.Body>
    </Layout.FlexRow>
  );
}

export default AddNewCheckIn;
