import { useCallback, useEffect } from 'react';
import { PostMessageDataType, PostMessageKeyType } from '@models/app';

type MessageDataType = Extract<PostMessageDataType, { key: PostMessageKeyType }>;

// 앱 -> 웹 메시지 수신 (GET)
const useGetAppMessage = ({
  cb,
  key,
}: {
  cb: (data: PostMessageDataType) => void;
  key: PostMessageKeyType;
}) => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { data } = event;
      if (typeof data !== 'string') return;
      const messageData = JSON.parse(data) as MessageDataType;
      if (messageData.key !== key) return;
      cb(messageData);
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [cb, key]);
};

// 웹 -> 앱 메시지 발신 (POST)
const usePostAppMessage = () => {
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

export { usePostAppMessage, useGetAppMessage };
