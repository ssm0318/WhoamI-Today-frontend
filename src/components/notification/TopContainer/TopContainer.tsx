import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Layout, SvgIcon, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { FetchState } from '@models/api/common';
import { TodayQuestionsSelector } from '@stores/todaysQuestions';
import { useBoundStore } from '@stores/useBoundStore';
import { getFriendRequests } from '@utils/apis/user';

export type TopContainerProps = {
  type: 'FriendRequest' | 'PromptsReceived';
};

export default function TopContainer({ type }: TopContainerProps) {
  const navigate = useNavigate();
  const [friendRequests, setFriendRequests] = useState<FetchState<number>>({ state: 'loading' });
  const { todaysQuestions, fetchTodaysQuestions } = useBoundStore(TodayQuestionsSelector);
  const [t] = useTranslation('translation', { keyPrefix: 'notifications' });

  const handleClick = () => {
    if (type === 'FriendRequest') {
      navigate('/friends/explore');
    } else {
      // TODO navigate to prompts page
    }
  };

  useAsyncEffect(async () => {
    getFriendRequests().then(({ count }) => {
      setFriendRequests({ state: 'hasValue', data: count });
    });
    await fetchTodaysQuestions();
  }, []);

  return (
    <Layout.FlexRow
      w="100%"
      justifyContent="space-between"
      alignItems="center"
      onClick={handleClick}
    >
      <Layout.FlexRow w="100%" alignItems="center">
        <SvgIcon
          name={type === 'FriendRequest' ? 'friend_requests' : 'prompts'}
          width={58}
          size={44}
        />
        <Typo type="label-large" ml={4}>
          {type === 'FriendRequest' ? t('see_friend_requests') : t('see_prompts_received')}
          {` (${
            type === 'FriendRequest' ? friendRequests.data || 0 : todaysQuestions?.length || 0
          })`}
        </Typo>
      </Layout.FlexRow>
      <Layout.FlexRow>
        <SvgIcon name="arrow_right" size={26} />
      </Layout.FlexRow>
    </Layout.FlexRow>
  );
}
