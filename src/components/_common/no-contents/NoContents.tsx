import { Font, Layout } from '@design-system';

interface Props {
  text?: string | null;
}

export default function NoContents({ text }: Props) {
  if (!text) return null;
  return (
    <Layout.LayoutBase w="100%" alignItems="center" p={20} mv={10}>
      <Layout.FlexCol w="100%" alignItems="center" bgColor="GRAY_7" rounded={12} ph={10} pv={20}>
        <Font.Display type="14_semibold" color="GRAY_12">
          {text}
        </Font.Display>
      </Layout.FlexCol>
    </Layout.LayoutBase>
  );
}
