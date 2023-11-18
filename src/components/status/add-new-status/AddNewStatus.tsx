import { Font, Layout, SvgIcon } from '@design-system';

function AddNewStatus() {
  return (
    <Layout.FlexRow gap={8} p={16} w="100%" alignItems="center" justifyContent="center">
      <SvgIcon name="new_add" size={24} />
      <Font.Body type="12_regular">New Check-in</Font.Body>
    </Layout.FlexRow>
  );
}

export default AddNewStatus;
