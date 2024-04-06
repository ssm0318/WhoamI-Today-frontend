import { useEffect, useRef, useState } from 'react';
import { ResponseMessageAction } from '@models/api/chat';

export function useChatRoomAutoScroll(messages: ResponseMessageAction[]) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [prevScrollHeight, setPrevScrollHeight] = useState<number | undefined>();

  // 메시지 목록이 업데이트되면 스크롤 이동
  useEffect(() => {
    if (!scrollRef.current) return;

    // infinite scroll에서 이전 채팅 메시지들을 불러오는 경우 스크롤 위치 유지
    if (prevScrollHeight) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight - prevScrollHeight;
      setPrevScrollHeight(undefined);
      return;
    }

    // 그 이외의 경우 새 메시지 추가시 맨 아래로 스크롤 이동
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  return {
    scrollRef,
    setPrevScrollHeight,
  };
}
