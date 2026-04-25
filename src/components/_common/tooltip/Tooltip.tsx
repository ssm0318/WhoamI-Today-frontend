import { ReactNode, useEffect, useRef, useState } from 'react';
import * as S from './Tooltip.styled';

interface TooltipProps {
  label: string;
  children: ReactNode;
  /** ms to keep visible after a tap; 0 = persist until next tap elsewhere */
  durationMs?: number;
}

const DEFAULT_DURATION = 1500;

function Tooltip({ label, children, durationMs = DEFAULT_DURATION }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleShow = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(true);
    if (durationMs > 0) {
      timerRef.current = setTimeout(() => setVisible(false), durationMs);
    }
  };

  return (
    <S.Container onClick={handleShow} onTouchStart={handleShow}>
      {children}
      <S.Bubble visible={visible}>{label}</S.Bubble>
    </S.Container>
  );
}

export default Tooltip;
