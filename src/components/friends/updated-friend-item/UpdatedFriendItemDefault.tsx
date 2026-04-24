import { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import FriendPinnedChip from '@components/friends/friend-pinned-chip/FriendPinnedChip';
import { Layout, Typo } from '@design-system';
import { UpdatedProfile } from '@models/api/friends';
import UpdatedLabel from '../updated-label/UpdatedLabel';
import { StyledProfileArea, StyledUpdatedFriendItem } from './UpdatedFriendItem.styled';

interface Props {
  user: UpdatedProfile;
  isMyPage: boolean;
}

function UpdatedFriendItemDefault({ user, isMyPage }: Props) {
  const { id, profile_image, username, current_user_read, unread_chat_count, description } = user;
  const pinnedCount = user.pinned_count ?? 0;

  const navigate = useNavigate();
  const handleClickProfile = () => {
    navigate(`/users/${username}`);
  };

  const handleClickChat = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`/users/${id}/chat`);
  };

  return (
    <Layout.FlexRow w="100%" ph={16} gap={16}>
      <StyledUpdatedFriendItem
        w="100%"
        alignItems="center"
        justifyContent="space-between"
        onClick={handleClickProfile}
      >
        <StyledProfileArea>
          <Layout.FlexRow alignItems="center" gap={7}>
            <ProfileImage imageUrl={profile_image} username={username} size={44} />
            <Layout.FlexCol>
              <Layout.FlexRow gap={4} alignItems="center">
                <Typo type="label-large" ellipsis={{ enabled: true, maxWidth: 100 }}>
                  {username}
                </Typo>
                {isMyPage && !current_user_read && <UpdatedLabel />}
              </Layout.FlexRow>
              {description && (
                <Typo type="label-medium" color="MEDIUM_GRAY" numberOfLines={1}>
                  {description}
                </Typo>
              )}
              {pinnedCount > 0 && (
                <Layout.FlexRow mt={4}>
                  <FriendPinnedChip username={username} pinnedCount={pinnedCount} />
                </Layout.FlexRow>
              )}
            </Layout.FlexCol>
          </Layout.FlexRow>
        </StyledProfileArea>
        {isMyPage && (
          <Layout.FlexRow
            w="100%"
            style={{ position: 'relative' }}
            justifyContent="flex-end"
            alignItems="center"
            gap={2}
          >
            <Layout.LayoutBase pb={2}>
              <Icon name="chat_send" size={22} onClick={handleClickChat} />
            </Layout.LayoutBase>
            {unread_chat_count > 0 && (
              <Layout.Absolute
                bgColor="BLACK"
                alignItems="center"
                rounded={10}
                t={-3}
                r={9}
                ph={3}
                pv={1}
                tl={['100%', 0]}
              >
                <Typo type="label-small" color="WHITE" fontSize={7} fontWeight={700}>
                  {unread_chat_count > 99 ? '99+' : unread_chat_count}
                </Typo>
              </Layout.Absolute>
            )}
          </Layout.FlexRow>
        )}
      </StyledUpdatedFriendItem>
    </Layout.FlexRow>
  );
}

export default UpdatedFriendItemDefault;
