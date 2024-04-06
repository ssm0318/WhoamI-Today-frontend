import { Layout, Typo } from '@design-system';

type BottomModalActionButtonProps = {
  text: string;
  status: 'normal' | 'disabled';
  onClick: () => void;
};

function BottomModalActionButton({ text, status, onClick }: BottomModalActionButtonProps) {
  return (
    <Layout.FlexRow
      bgColor={status === 'normal' ? 'SECONDARY' : 'LIGHT_GRAY'}
      onClick={onClick}
      w="100%"
      pv={10}
      justifyContent="center"
      rounded={6}
    >
      <Typo type="button-medium">{text}</Typo>
    </Layout.FlexRow>
  );
}

export default BottomModalActionButton;
