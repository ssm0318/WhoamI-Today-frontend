/**
 * 열려있는 모든 BottomModal을 강제로 닫는 유틸리티 함수
 * @returns {boolean} 모달 닫기 시도 여부
 */
export const closeAllModals = (): boolean => {
  let modalClosed = false;

  try {
    // 1. Escape 키 이벤트 발생시키기 (많은 모달이 ESC 키로 닫힘)
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        code: 'Escape',
        bubbles: true,
      }),
    );
    modalClosed = true;

    // 2. 모달 배경 찾아서 클릭 (배경 클릭으로 모달이 닫히는 경우)
    const modalBackgrounds = Array.from(
      document.querySelectorAll(
        '[class*="BottomModal__Background"], [class*="Modal__Background"], [class*="background"], [class*="Background"]',
      ),
    );

    if (modalBackgrounds.length > 0) {
      modalBackgrounds.forEach((bg) => {
        try {
          (bg as HTMLElement).click();
          modalClosed = true;
        } catch (e) {
          console.error('모달 배경 클릭 실패', e);
        }
      });
    }

    // 3. 닫기 버튼 찾아서 클릭
    const closeButtons = Array.from(
      document.querySelectorAll(
        'svg[name="close"], [class*="close"], [class*="Close"], button[aria-label="close"]',
      ),
    );

    if (closeButtons.length > 0) {
      closeButtons.forEach((btn) => {
        try {
          (btn as HTMLElement).click();
          modalClosed = true;
        } catch (e) {
          console.error('닫기 버튼 클릭 실패', e);
        }
      });
    }

    // 4. modal-container 내용 숨기기 (innerHTML 직접 조작은 피함)
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
      modalContainer.style.display = 'none';
      modalClosed = true;
    }

    // 5. DOM 직접 조작하는 방식은 제거함 (React와 충돌 발생)

    // 6. body에 추가된 no-scroll 클래스 제거 (많은 모달이 body에 클래스를 추가해 스크롤을 막음)
    document.body.classList.remove('no-scroll', 'modal-open', 'overflow-hidden');

    return modalClosed;
  } catch (error) {
    return false;
  }
};

/**
 * 모달을 닫고 지정된 경로로 네비게이션하는 함수
 * @param navigate React Router의 navigate 함수
 * @param path 이동할 경로
 * @param delay 모달 닫은 후 네비게이션까지의 지연 시간 (ms)
 */
export const closeModalAndNavigate = (
  navigate: (path: string) => void,
  path: string,
  delay = 300, // 적절한 지연 시간 설정
): void => {
  // 먼저 모달 닫기 시도
  closeAllModals();

  // 모달 닫은 후 지연 시간을 두고 네비게이션 수행
  setTimeout(() => {
    navigate(path);
  }, delay);
};
