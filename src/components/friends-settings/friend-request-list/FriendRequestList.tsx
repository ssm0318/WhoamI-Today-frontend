import { useTranslation } from 'react-i18next';
import FriendItem from '@components/friends-settings/friend-item/FriendItem';
import { Font, Layout } from '@design-system';
import { friendList } from '@mock/friends';

export default function FriendRequestList() {
  const [t] = useTranslation('translation', { keyPrefix: 'settings.friends.request_list' });

  // TODO: GET 받은 친구 요청 목록

  return (
    <Layout.FlexCol w="100%" pl={10} pr={10} gap={8}>
      <Font.Body type="14_regular" color="GRAY_12" ml={5} mt={14} mb={2}>
        {t('title', { number: friendList.length })}
      </Font.Body>
      {friendList.length ? (
        <Layout.FlexCol w="100%" gap={8}>
          {friendList.map((friend) => (
            <FriendItem key={friend.id} type="request" friend={friend} />
          ))}
        </Layout.FlexCol>
      ) : (
        <NoRequests />
      )}
    </Layout.FlexCol>
  );
}

function NoRequests() {
  const [t] = useTranslation('translation', {
    keyPrefix: 'settings.friends.request_list.no_request',
  });

  return (
    <Layout.FlexRow
      w="100%"
      alignSelf="center"
      justifyContent="space-evenly"
      bgColor="GRAY_7"
      rounded={13}
      pt={10}
      pb={10}
    >
      <Layout.FlexCol w="100$" alignItems="center">
        <Font.Body type="14_semibold" color="GRAY_12">
          {t('title')}
        </Font.Body>
        <Font.Body type="14_semibold" color="GRAY_12">
          {t('text')}
        </Font.Body>
      </Layout.FlexCol>
    </Layout.FlexRow>
  );
}
