import { ColorKeys, Font, Layout, Typo } from '@design-system';

interface Props {
  title?: string | null;
  text?: string | null;
  ph?: number;
  pv?: number;
  mv?: number;
  bgColor?: ColorKeys;
  fontColor?: ColorKeys;
}

export default function NoContents({
  title,
  text,
  mv,
  ph = 10,
  pv = 10,
  bgColor = 'LIGHT',
  fontColor = 'MEDIUM_GRAY',
}: Props) {
  return (
    <Layout.FlexCol
      w="100%"
      alignItems="center"
      bgColor={bgColor}
      rounded={12}
      ph={ph}
      pv={pv}
      mv={mv}
    >
      {/** FIXME: 대응되는 Typo 타입이 없음. */}
      {title && (
        <Font.Body type="14_semibold" color={fontColor}>
          {title}
        </Font.Body>
      )}
      {text && (
        <Typo type="body-medium" color={fontColor}>
          {text}
        </Typo>
      )}
    </Layout.FlexCol>
  );
}
