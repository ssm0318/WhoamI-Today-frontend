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
      console.log('message received');

      const { data } = event;

      if (data.type === 'webpackWarnings' || data.type === 'webpackInvalid') return;

      try {
        const parsedData = JSON.parse(data);
        console.log('parsedData');
        console.log(parsedData);
        if (!parsedData.key || parsedData.key !== key) return;

        const messageData = parsedData.data as PostMessageKeyToData[K];
        cb(messageData);
      } catch (error) {
        // Handle parsing error silently
        console.error('Error parsing message data:');
        console.error(error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
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
