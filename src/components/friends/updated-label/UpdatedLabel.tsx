import { Layout, Typo } from '@design-system';

function UpdatedLabel() {
  return (
    <Layout.LayoutBase
      ph={4}
      justifyContent="center"
      alignItems="center"
      bgColor="UPDATED"
      rounded={4}
    >
      <Typo type="label-small" color="WHITE">
        UP
      </Typo>
    </Layout.LayoutBase>
  );
}
export default UpdatedLabel;
