import { ColorKeys, Layout, Typo } from '@design-system';

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
  ph,
  pv,
  bgColor,
  fontColor = 'BLACK',
}: Props) {
  const hasBackground = bgColor !== undefined;
  return (
    <Layout.FlexCol
      w="100%"
      alignItems="center"
      bgColor={bgColor}
      rounded={hasBackground ? 12 : undefined}
      ph={ph ?? (hasBackground ? 10 : 0)}
      pv={pv ?? (hasBackground ? 10 : 16)}
      mv={mv}
    >
      {title && (
        <Typo type="title-medium" color={fontColor}>
          {title}
        </Typo>
      )}
      {text && (
        <Typo type="body-large" color={fontColor}>
          {text}
        </Typo>
      )}
    </Layout.FlexCol>
  );
}
