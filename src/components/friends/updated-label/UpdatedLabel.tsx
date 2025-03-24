import { Layout, Typo } from '@design-system';

interface UpdatedLabelProps {
  fontSize?: number;
}

function UpdatedLabel({ fontSize = 10 }: UpdatedLabelProps) {
  return (
    <Layout.LayoutBase
      ph={4}
      justifyContent="center"
      alignItems="center"
      style={{ backgroundColor: 'red' }}
      rounded={4}
    >
      <Typo type="label-small" color="WHITE" fontSize={fontSize}>
        UP
      </Typo>
    </Layout.LayoutBase>
  );
}
export default UpdatedLabel;
