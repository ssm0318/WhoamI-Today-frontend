import { IconNames, Layout, SvgIcon, Typo } from '@design-system';

export type TopContainerProps = {
  title: string;
  value: number;
  icon: IconNames;
  onClick: () => void;
};

export default function TopContainer({ title, icon, value, onClick }: TopContainerProps) {
  return (
    <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center" onClick={onClick}>
      <Layout.FlexRow w="100%" alignItems="center">
        <SvgIcon name={icon} width={58} size={44} />
        <Typo type="label-large" ml={4}>
          {`${title} (${value})`}
        </Typo>
      </Layout.FlexRow>
      <Layout.FlexRow>
        <SvgIcon name="arrow_right" size={26} />
      </Layout.FlexRow>
    </Layout.FlexRow>
  );
}
