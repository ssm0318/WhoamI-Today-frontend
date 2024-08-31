import { useEffect, useMemo, useState } from 'react';
import { getMobileDeviceInfo } from '@utils/getUserAgent';

/**
 * IOS에서 가상키보드가 열리기 전에 window innerHeight와 VisualViewport height가 같고,
 * 키보드 열렸을 때는 window innerHeight와 VisualViewport height 다르다는 점을 이용하여,
 * 가상 키보드가 열렸는지 여부를 알아냄.
 */
export const useIsVirtualKeyboardOpenInIOS = () => {
  const { isIOS } = getMobileDeviceInfo();

  const [viewPortHeight, setViewPortHeight] = useState<number | undefined>();
  const [offsetHeight, setOffsetHeight] = useState<number | undefined>();

  useEffect(() => {
    function handleResize() {
      const viewportHeight = visualViewport?.height;
      const bodyHeight = document.body.offsetHeight;

      setViewPortHeight(viewportHeight);
      setOffsetHeight(bodyHeight);
    }

    visualViewport?.addEventListener('resize', handleResize);
    return () => visualViewport?.removeEventListener('resize', handleResize);
  }, []);

  return useMemo(() => {
    if (!isIOS) return false;
    if (offsetHeight === undefined || viewPortHeight === undefined) return false;
    return offsetHeight !== viewPortHeight;
  }, [isIOS, offsetHeight, viewPortHeight]);
};
