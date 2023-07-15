import { useCallback, useEffect } from 'react';
import { PostMessageDataType, PostMessageKeyToData, PostMessageKeyType } from '@models/app';

type MessageDataType = Extract<PostMessageDataType, { key: PostMessageKeyType }>;

const isPostMessageData = (data: any): data is PostMessageDataType => {
  return data;
};

// 앱 -> 웹 메시지 수신 (GET)
export const useGetAppMessage = <K extends PostMessageKeyType>({
  cb,
  key,
}: {
  cb: (data: PostMessageKeyToData[K]) => void;
  key: K;
}) => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { data } = event;
      if (data.type) return;
      const parsedData = JSON.parse(data);
      if (!parsedData.key || parsedData.key !== key) return;
      if (!isPostMessageData(parsedData.data)) return;

      const messageData = parsedData.data as PostMessageKeyToData[K];
      cb(messageData);
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
