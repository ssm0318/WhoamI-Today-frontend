import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader } from '@components/_common/loader/Loader.styled';
import MainContainer from '@components/_common/main-container/MainContainer';
import ReceivedPromptList from '@components/notification/received-prompt-list/ReceivedPromptList';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { Notification } from '@models/notification';
import { getNotifications } from '@utils/apis/notification';

export default function ReceivedPrompts() {
  const [t] = useTranslation('translation', { keyPrefix: 'notifications' });
  const [receivedPrompts, setReceivedPrompts] = useState<Notification[]>(MOCK_NOTIFICATION);
  const [nextPage, setNextPage] = useState<string | null | undefined>(undefined);

  const { isLoading, targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (nextPage === null) return setIsLoading(false);
    await fetchReceivedPrompts(nextPage ?? null);
  });

  const fetchReceivedPrompts = async (page: string | null) => {
    // TODO: Received Prompts api로 교체
    const { results, next } = await getNotifications(page);
    if (!results) return;
    setNextPage(next);

    const prompts = results.filter(({ is_response_request }) => is_response_request);
    setReceivedPrompts((prev) => {
      return [...prev, ...prompts];
    });
    setIsLoading(false);
  };

  const recentPrompts = receivedPrompts.filter((n) => n.is_recent);
  const restPrompts = receivedPrompts.filter((n) => !n.is_recent);

  return (
    <MainContainer>
      <SubHeader title="Received Prompts" />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT} w="100%" ph={16}>
        <ReceivedPromptList title={t('last_7_days')} prompts={recentPrompts} />
        <ReceivedPromptList title={t('last_30_days')} prompts={restPrompts} />
      </Layout.FlexCol>
      <div ref={targetRef} />
      {isLoading && (
        <Layout.FlexRow w="100%" h={40}>
          <Loader />
        </Layout.FlexRow>
      )}
    </MainContainer>
  );
}

const MOCK_NOTIFICATION: Notification[] = [
  {
    id: 1,
    created_at: '2024-05-11T06:29:29.412343+09:00',
    redirect_url: '',
    is_read: false,
    message: 'hello',
    is_response_request: true,
    is_friend_request: false,
    is_recent: true,
    question_content: 'Question 1',
    notification_type: 'ResponseRequest',
    recent_actors: [{ id: 1, profile_pic: '', profile_image: '', username: 'user1' }],
  },
  {
    id: 2,
    created_at: '2024-05-11T04:00:29.412343+09:00',
    redirect_url: '',
    is_read: false,
    message: 'hello',
    is_response_request: true,
    is_friend_request: false,
    is_recent: true,
    question_content: 'Question 1',
    notification_type: 'ResponseRequest',
    recent_actors: [{ id: 2, profile_pic: '', profile_image: '', username: 'user2' }],
  },
  {
    id: 3,
    created_at: '2024-05-11T01:29:29.412343+09:00',
    redirect_url: '',
    is_read: false,
    message: 'hello',
    is_response_request: true,
    is_friend_request: false,
    is_recent: true,
    question_content: 'Question 1',
    notification_type: 'ResponseRequest',
    recent_actors: [{ id: 1, profile_pic: '', profile_image: '', username: 'user1' }],
  },
  {
    id: 4,
    created_at: '2024-05-10T18:29:29.412343+09:00',
    redirect_url: '',
    is_read: false,
    message: 'hello',
    is_response_request: true,
    is_friend_request: false,
    is_recent: true,
    question_content: 'Question 1',
    notification_type: 'ResponseRequest',
    recent_actors: [{ id: 2, profile_pic: '', profile_image: '', username: 'user2' }],
  },
  {
    id: 5,
    created_at: '2024-05-10T18:29:29.412343+09:00',
    redirect_url: '',
    is_read: false,
    message: 'hello',
    is_response_request: true,
    is_friend_request: false,
    is_recent: true,
    question_content: 'Question 1',
    notification_type: 'ResponseRequest',
    recent_actors: [{ id: 1, profile_pic: '', profile_image: '', username: 'user1' }],
  },
  {
    id: 6,
    created_at: '2024-05-10T18:29:29.412343+09:00',
    redirect_url: '',
    is_read: false,
    message: 'hello',
    is_response_request: true,
    is_friend_request: false,
    is_recent: true,
    question_content: 'Question 4',
    notification_type: 'ResponseRequest',
    recent_actors: [{ id: 3, profile_pic: '', profile_image: '', username: 'user3' }],
  },
  {
    id: 7,
    created_at: '2024-05-09T18:29:29.412343+09:00',
    redirect_url: '',
    is_read: false,
    message: 'hello',
    is_response_request: true,
    is_friend_request: false,
    is_recent: true,
    question_content: 'Question 1',
    notification_type: 'ResponseRequest',
    recent_actors: [{ id: 1, profile_pic: '', profile_image: '', username: 'user1' }],
  },
  {
    id: 8,
    created_at: '2024-05-06T18:29:29.412343+09:00',
    redirect_url: '',
    is_read: false,
    message: 'hello',
    is_response_request: true,
    is_friend_request: false,
    is_recent: false,
    question_content: 'Question 5',
    notification_type: 'ResponseRequest',
    recent_actors: [{ id: 1, profile_pic: '', profile_image: '', username: 'user1' }],
  },
  {
    id: 9,
    created_at: '2024-05-06T18:29:29.412343+09:00',
    redirect_url: '',
    is_read: false,
    message: 'hello',
    is_response_request: true,
    is_friend_request: false,
    is_recent: false,
    question_content: 'Question 6',
    notification_type: 'ResponseRequest',
    recent_actors: [{ id: 1, profile_pic: '', profile_image: '', username: 'user1' }],
  },
  {
    id: 10,
    created_at: '2024-05-07T18:29:29.412343+09:00',
    redirect_url: '',
    is_read: false,
    message: 'hello',
    is_response_request: true,
    is_friend_request: false,
    is_recent: false,
    question_content: 'Question 3',
    notification_type: 'ResponseRequest',
    recent_actors: [{ id: 1, profile_pic: '', profile_image: '', username: 'user1' }],
  },
  {
    id: 11,
    created_at: '2024-05-02T18:29:29.412343+09:00',
    redirect_url: '',
    is_read: false,
    message: 'hello',
    is_response_request: true,
    is_friend_request: false,
    is_recent: false,
    question_content: 'Question 2',
    notification_type: 'ResponseRequest',
    recent_actors: [{ id: 1, profile_pic: '', profile_image: '', username: 'user1' }],
  },
  {
    id: 12,
    created_at: '2024-05-01T18:29:29.412343+09:00',
    redirect_url: '',
    is_read: false,
    message: 'hello',
    is_response_request: true,
    is_friend_request: false,
    is_recent: false,
    question_content: 'Question 1',
    notification_type: 'ResponseRequest',
    recent_actors: [{ id: 1, profile_pic: '', profile_image: '', username: 'user1' }],
  },
  {
    id: 13,
    created_at: '2024-05-01T18:29:29.412343+09:00',
    redirect_url: '',
    is_read: false,
    message: 'hello',
    is_response_request: true,
    is_friend_request: false,
    is_recent: false,
    question_content: 'Question 3',
    notification_type: 'ResponseRequest',
    recent_actors: [{ id: 1, profile_pic: '', profile_image: '', username: 'user1' }],
  },
];
