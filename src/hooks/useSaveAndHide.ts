import { useCallback, useEffect, useState } from 'react';

interface UseSaveAndHideOptions {
  delayBeforeAnimation?: number; // 애니메이션 시작 전 대기 시간 (ms)
  animationDuration?: number; // 애니메이션 지속 시간 (ms)
}

interface UseSaveAndHideReturn {
  isSaved: boolean;
  showCard: boolean;
  isAnimating: boolean;
  handleSave: () => void;
}

/**
 * 저장 후 일정 시간 뒤 애니메이션과 함께 카드를 숨기는 로직을 제공하는 훅
 * @param options - 애니메이션 타이밍 옵션
 * @returns 저장 상태, 카드 표시 여부, 애니메이션 상태, 저장 핸들러
 */
export function useSaveAndHide(options: UseSaveAndHideOptions = {}): UseSaveAndHideReturn {
  const { delayBeforeAnimation = 2000, animationDuration = 500 } = options;

  const [isSaved, setIsSaved] = useState(false);
  const [showCard, setShowCard] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSave = useCallback(() => {
    setIsSaved(true);
  }, []);

  // isSaved가 true가 되면 delayBeforeAnimation 후에 애니메이션 시작, 애니메이션 끝나면 카드 숨김
  useEffect(() => {
    if (isSaved) {
      let hideTimer: ReturnType<typeof setTimeout>;
      const animationTimer = setTimeout(() => {
        setIsAnimating(true);
        // 애니메이션 시간 후에 카드를 숨김
        hideTimer = setTimeout(() => {
          setShowCard(false);
        }, animationDuration);
      }, delayBeforeAnimation);

      return () => {
        clearTimeout(animationTimer);
        if (hideTimer) {
          clearTimeout(hideTimer);
        }
      };
    }
  }, [isSaved, delayBeforeAnimation, animationDuration]);

  return {
    isSaved,
    showCard,
    isAnimating,
    handleSave,
  };
}
