import { useNavigate } from 'react-router-dom';
import { Layout, SvgIcon, Typo } from '@design-system';

export type TopContainerProps = {
  type: 'FriendRequest' | 'PromptsReceived';
};

export default function TopContainer({ type }: TopContainerProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (type === 'FriendRequest') {
      navigate('/friends/explore');
    } else {
      // TODO navigate to prompts page
    }
  };

  return (
    <Layout.FlexRow
      w="100%"
      justifyContent="space-between"
      alignItems="center"
      ph={16}
      onClick={handleClick}
    >
      <Layout.FlexRow w="100%" alignItems="center">
        <SvgIcon
          name={type === 'FriendRequest' ? 'friend_requests' : 'prompts'}
          width={58}
          size={44}
        />
        <Typo type="label-large" ml={4}>
          {type === 'FriendRequest' ? 'See Friend Requests' : 'See Prompts Received'}
          {` (${type === 'FriendRequest' ? 24 : 12})`}
        </Typo>
      </Layout.FlexRow>
      <Layout.FlexRow>
        <SvgIcon name="arrow_right" size={26} />
      </Layout.FlexRow>
    </Layout.FlexRow>
  );
}
