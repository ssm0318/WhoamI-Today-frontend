import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DEFAULT_MARGIN, SCREEN_WIDTH, Z_INDEX } from '@constants/layout';
import { Layout, Typo } from '@design-system';

interface ToastBarProps {
  text: string;
  bottom?: number;
  RightComponent?: ReactNode;
  closeToastBar?: () => void;
}

export default function ToastBar({
  text,
  bottom = 16,
  RightComponent,
  closeToastBar,
}: ToastBarProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      closeToastBar?.();
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [closeToastBar]);

  return createPortal(
    <Layout.Absolute
      z={Z_INDEX.TOAST_CONTAINER}
      b={bottom}
      l="50%"
      r={0}
      w="100%"
      tl={['-50%', 0]}
      justifyContent="center"
    >
      <Layout.FlexRow
        justifyContent={RightComponent ? 'space-between' : 'center'}
        bgColor="LIGHT_GRAY"
        rounded={12}
        ph={12}
        pv={16}
        w={SCREEN_WIDTH - 2 * DEFAULT_MARGIN}
      >
        <Typo color="DARK_GRAY" type="body-large">
          {text}
        </Typo>
        {RightComponent && RightComponent}
      </Layout.FlexRow>
    </Layout.Absolute>,
    document.getElementById('toastbar-container') || document.body,
  );
}
