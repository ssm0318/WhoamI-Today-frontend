import { Font, Layout } from '@design-system';

interface Props {
  title?: string | null;
  text?: string | null;
  ph?: number;
  mv?: number;
}

export default function NoContents({ title, text, ph = 20, mv = 10 }: Props) {
  return (
    <Layout.LayoutBase w="100%" alignItems="center" ph={ph} mv={mv}>
      <Layout.FlexCol w="100%" alignItems="center" bgColor="GRAY_7" rounded={13} ph={10} pv={20}>
        {title && (
          <Font.Body type="14_semibold" color="GRAY_12">
            {title}
          </Font.Body>
        )}
        {text && (
          <Font.Body type="14_semibold" color="GRAY_12">
            {text}
          </Font.Body>
        )}
      </Layout.FlexCol>
    </Layout.LayoutBase>
  );
}
