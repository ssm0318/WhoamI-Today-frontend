import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BOTTOM_TABBAR_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import { cancelChatRequest, respondToChatRequest, sendChatRequest } from '@utils/apis/chat';

interface Props {
  userId: number;
  sentRequest: boolean;
  receivedRequestId: number | null;
  onRequestSent: () => void;
  onAccepted: () => void;
  onDeclined: () => void;
  onCancelled: () => void;
}

function ChatRequestBar({
  userId,
  sentRequest,
  receivedRequestId,
  onRequestSent,
  onAccepted,
  onDeclined,
  onCancelled,
}: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'chat.request' });
  const [busy, setBusy] = useState(false);
  const [localSent, setLocalSent] = useState(sentRequest);

  const handleSendRequest = async () => {
    if (busy || localSent) return;
    setBusy(true);
    try {
      await sendChatRequest(userId);
      setLocalSent(true);
      onRequestSent();
    } catch {
      setLocalSent(true);
    } finally {
      setBusy(false);
    }
  };

  const handleAccept = async () => {
    if (busy || receivedRequestId == null) return;
    setBusy(true);
    try {
      await respondToChatRequest(receivedRequestId, true);
      onAccepted();
    } finally {
      setBusy(false);
    }
  };

  const handleDecline = async () => {
    if (busy || receivedRequestId == null) return;
    setBusy(true);
    try {
      await respondToChatRequest(receivedRequestId, false);
      onDeclined();
    } finally {
      setBusy(false);
    }
  };

  const handleCancelRequest = async () => {
    if (busy || !localSent) return;
    if (!window.confirm(t('cancel_confirm') ?? '')) return;
    setBusy(true);
    try {
      await cancelChatRequest(userId);
    } catch {
      // Already gone — fall through to local reset
    }
    setLocalSent(false);
    onCancelled();
    setBusy(false);
  };

  const renderContent = () => {
    if (receivedRequestId != null) {
      return (
        <Layout.FlexCol w="100%" gap={8}>
          <Typo type="body-small" color="MEDIUM_GRAY">
            {t('received_hint')}
          </Typo>
          <Layout.FlexRow gap={8} w="100%">
            <button
              type="button"
              onClick={handleDecline}
              disabled={busy}
              style={{
                flex: 1,
                background: '#F0F0F0',
                color: '#333',
                border: 'none',
                borderRadius: 8,
                padding: '10px 16px',
                fontSize: 14,
                fontWeight: 600,
                cursor: busy ? 'default' : 'pointer',
              }}
            >
              {t('decline')}
            </button>
            <button
              type="button"
              onClick={handleAccept}
              disabled={busy}
              style={{
                flex: 1,
                background: '#8700FF',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                padding: '10px 16px',
                fontSize: 14,
                fontWeight: 600,
                cursor: busy ? 'default' : 'pointer',
              }}
            >
              {t('accept')}
            </button>
          </Layout.FlexRow>
        </Layout.FlexCol>
      );
    }

    if (localSent) {
      return (
        <Layout.FlexCol w="100%" gap={6} alignItems="center">
          <button
            type="button"
            onClick={handleCancelRequest}
            disabled={busy}
            style={{
              width: '100%',
              background: '#F0F0F0',
              color: '#333',
              border: 'none',
              borderRadius: 8,
              padding: '10px 16px',
              fontSize: 14,
              fontWeight: 600,
              cursor: busy ? 'default' : 'pointer',
            }}
          >
            {t('cancel')}
          </button>
          <Typo type="body-small" color="MEDIUM_GRAY">
            {t('sent_hint')}
          </Typo>
        </Layout.FlexCol>
      );
    }

    return (
      <Layout.FlexCol w="100%" gap={6} alignItems="center">
        <button
          type="button"
          onClick={handleSendRequest}
          disabled={busy}
          style={{
            width: '100%',
            background: '#8700FF',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '10px 16px',
            fontSize: 14,
            fontWeight: 600,
            cursor: busy ? 'default' : 'pointer',
          }}
        >
          {t('send')}
        </button>
        <Typo type="body-small" color="MEDIUM_GRAY">
          {t('not_friends_hint')}
        </Typo>
      </Layout.FlexCol>
    );
  };

  return (
    <Layout.Fixed
      b={BOTTOM_TABBAR_HEIGHT}
      z={10}
      style={{
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 500,
      }}
    >
      <Layout.FlexCol
        w="100%"
        ph={14}
        pv={12}
        bgColor="WHITE"
        style={{ borderTop: '1px solid #D9D9D9' }}
      >
        {renderContent()}
      </Layout.FlexCol>
    </Layout.Fixed>
  );
}

export default ChatRequestBar;
