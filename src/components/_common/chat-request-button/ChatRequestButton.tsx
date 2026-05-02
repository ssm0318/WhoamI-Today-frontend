import { MouseEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import CommonDialog from '@components/_common/alert-dialog/common-dialog/CommonDialog';
import { useIsPreviewMode } from '@components/view-as/PreviewModeContext';
import { Button } from '@design-system';
import { UserProfile } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { cancelChatRequest, sendChatRequest } from '@utils/apis/chat';

const RequestedButton = styled(Button.Highlight)`
  && > button > .button_component {
    background-color: ${({ theme }) => theme.MEDIUM_GRAY};
  }
`;

interface Props {
  user: UserProfile;
  onChange?: () => void;
}

function ChatRequestButton({ user, onChange }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'chat.request.button' });
  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));
  const previewMode = useIsPreviewMode();

  const [sent, setSent] = useState(user.sent_chat_request_to);
  const [busy, setBusy] = useState(false);
  const [isCancelDialogVisible, setIsCancelDialogVisible] = useState(false);

  useEffect(() => {
    setSent(user.sent_chat_request_to);
  }, [user.sent_chat_request_to]);

  if (user.accepted_chat_request) return null;

  const handleClickRequest = async (e: MouseEvent) => {
    e.stopPropagation();
    if (previewMode) return;
    if (busy || sent) return;
    setBusy(true);
    try {
      await sendChatRequest(user.id);
      setSent(true);
      onChange?.();
    } catch {
      // Treat duplicate/conflict as already-sent
      setSent(true);
    } finally {
      setBusy(false);
    }
  };

  const handleClickCancel = (e: MouseEvent) => {
    e.stopPropagation();
    if (previewMode) return;
    setIsCancelDialogVisible(true);
  };

  const handleConfirmCancel = async () => {
    setBusy(true);
    try {
      await cancelChatRequest(user.id);
    } catch {
      openToast({ message: t('cancel_dialog.title') ?? '' });
    }
    setSent(false);
    setIsCancelDialogVisible(false);
    setBusy(false);
    onChange?.();
  };

  return (
    <>
      {sent ? (
        <RequestedButton
          status="normal"
          text={t('requested_chat')}
          sizing="stretch"
          onClick={handleClickCancel}
        />
      ) : (
        <Button.Highlight
          status="normal"
          text={t('request')}
          sizing="stretch"
          onClick={handleClickRequest}
        />
      )}
      {isCancelDialogVisible && (
        <CommonDialog
          visible={isCancelDialogVisible}
          title={t('cancel_dialog.title')}
          content={t('cancel_dialog.content', { user: user.username })}
          cancelText={t('cancel_dialog.cancel')}
          confirmText={t('cancel_dialog.confirm')}
          confirmTextColor="WARNING"
          onClickConfirm={handleConfirmCancel}
          onClickClose={() => setIsCancelDialogVisible(false)}
        />
      )}
    </>
  );
}

export default ChatRequestButton;
