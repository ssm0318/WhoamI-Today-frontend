import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { DEFAULT_MARGIN, SCREEN_WIDTH, Z_INDEX } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import { AnimatedToastBarContainer, AnimationState } from './ToastBar.styled';

interface ToastBarProps {
  text: string;
  bottom?: number;
  RightComponent?: ReactNode;
  closeToastBar?: () => void;
  timeout?: number;
}

export default function ToastBar({
  text,
  bottom = 16,
  RightComponent,
  closeToastBar,
  timeout = 3000,
}: ToastBarProps) {
  const [animationState, setAnimationState] = useState<AnimationState>('show');

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationState('hide');
      setTimeout(() => {
        closeToastBar?.();
      }, 500);
    }, timeout);

    return () => {
      clearTimeout(timer);
    };
  }, [closeToastBar, timeout]);

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
      <AnimatedToastBarContainer
        state={animationState}
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
      </AnimatedToastBarContainer>
    </Layout.Absolute>,
    document.getElementById('toast-container') || document.body,
  );
}
