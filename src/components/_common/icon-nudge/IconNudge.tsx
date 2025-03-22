import { Layout, Typo } from '@design-system';

interface IconNudgeProps {
  count?: number;
  size?: number;
}

function IconNudge({ count, size = 10 }: IconNudgeProps) {
  return (
    <Layout.Absolute
      w={size}
      h={size}
      bgColor="NUDGE"
      rounded={size / 2}
      t={0}
      r={0}
      alignItems="center"
      justifyContent="center"
    >
      {count && (
        <Typo type="label-small" color="WHITE" textAlign="center" bold>
          {count}
        </Typo>
      )}
    </Layout.Absolute>
  );
}

export default IconNudge;
