import React, { MouseEvent } from 'react';
import { Sheet } from 'react-modal-sheet';
import * as S from './BottomModal.styled';

interface BottomModalProps {
  visible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  heightMode?: 'content' | 'full';
}

function BottomModal({ visible, onClose, children, heightMode = 'content' }: BottomModalProps) {
  const onClickModal = (e: MouseEvent) => e.stopPropagation();

  const onCloseModal = () => {
    onClose?.();
  };

  return (
    <Sheet
      isOpen={visible}
      onClose={onCloseModal}
      detent={heightMode === 'full' ? 'full-height' : 'content-height'}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <Sheet.Scroller>
            <S.Body onClick={onClickModal}>{children}</S.Body>
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={onCloseModal} />
    </Sheet>
  );
}

export default BottomModal;
