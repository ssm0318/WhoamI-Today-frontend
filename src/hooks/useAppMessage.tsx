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
        const parsedData = JSON.parse(data);
        if (!parsedData.key || parsedData.key !== key) return;

        const messageData = parsedData.data as PostMessageKeyToData[K];
        cb(messageData);
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
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        actionType: key,
        ...data,
      }),
    );
  }, []);

  return sendMessage;
};
