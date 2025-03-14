import { useCallback, useEffect } from 'react';
import { PostMessageDataType, PostMessageKeyToData, PostMessageKeyType } from '@models/app';
import { isApp } from '@utils/getUserAgent';

type MessageDataType = Extract<PostMessageDataType, { key: PostMessageKeyType }>;

// 앱 -> 웹 메시지 수신 (GET)
export const useGetAppMessage = <K extends PostMessageKeyType>({
  cb,
  key,
}: {
  cb: (data: PostMessageKeyToData[K]) => void;
  key: K;
}) => {
  useEffect(() => {
    if (!isApp) return;
    const handleMessage = (event: MessageEvent) => {
      const { data } = event;
      try {
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

        // 앱에서는 key 대신 type 필드를 사용하고 있으므로 확인
        const messageKey = parsedData.key || parsedData.type || parsedData.actionType;
        if (!messageKey || messageKey !== key) return;

        // 앱에서 보내는 데이터 형식에 맞춰 처리
        // KEYBOARD_HEIGHT 메시지인 경우 height 값만 전달하는 특별 처리
        if (key === 'KEYBOARD_HEIGHT') {
          cb({ key, height: parsedData.height } as PostMessageKeyToData[K]);
        } else {
          const messageData = parsedData.data as PostMessageKeyToData[K];
          cb(messageData);
        }
      } catch (error) {
        // Handle parsing error silently
        console.error('Error parsing message data:', error);
      }
    };

    // For Android
    const handleDocumentMessage = (event: Event) => {
      if ('data' in event) {
        handleMessage(event as unknown as MessageEvent);
      }
    };

    window.addEventListener('message', handleMessage);
    document?.addEventListener('message' as any, handleDocumentMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      document?.removeEventListener('message' as any, handleDocumentMessage);
    };
  }, [cb, key]);
};

// 웹 -> 앱 메시지 발신 (POST)
export const usePostAppMessage = () => {
  const sendMessage = useCallback((key: PostMessageKeyType, data: Omit<MessageDataType, 'key'>) => {
    if (!window.ReactNativeWebView) return;

    // 앱에서 처리할 수 있는 형식으로 메시지 보내기
    if (key === 'KEYBOARD_OPENED') {
      // KEYBOARD_OPENED는 타입만 보내기
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: key,
        }),
      );
    } else {
      // 기존 메시지 형식 유지
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          actionType: key,
          ...data,
        }),
      );
    }
  }, []);

  return sendMessage;
};
