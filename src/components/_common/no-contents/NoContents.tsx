import { ColorKeys, Font, Layout } from '@design-system';

interface Props {
  title?: string | null;
  text?: string | null;
  ph?: number;
  mv?: number;
  bgColor?: ColorKeys;
  fontColor?: ColorKeys;
}

export default function NoContents({
  title,
  text,
  ph = 20,
  mv = 10,
  bgColor = 'GRAY_7',
  fontColor = 'MEDIUM_GRAY',
}: Props) {
  return (
    <Layout.LayoutBase w="100%" alignItems="center" ph={ph} mv={mv}>
      <Layout.FlexCol w="100%" alignItems="center" bgColor={bgColor} rounded={13} ph={10} pv={20}>
        {title && (
          <Font.Body type="14_semibold" color={fontColor}>
            {title}
          </Font.Body>
        )}
        {text && (
          <Font.Body type="14_regular" color={fontColor}>
            {text}
          </Font.Body>
        )}
      </Layout.FlexCol>
    </Layout.LayoutBase>
  );
}
