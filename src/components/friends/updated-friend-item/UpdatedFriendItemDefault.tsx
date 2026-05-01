import { MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import UserMoreModal from '@components/user-page/UserMoreModal';
import { Layout, Typo } from '@design-system';
import { UpdatedProfile } from '@models/api/friends';
import { UserProfile } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { StyledProfileArea, StyledUpdatedFriendItem } from './UpdatedFriendItem.styled';

interface Props {
  user: UpdatedProfile;
  isMyPage: boolean;
  showMoreButton?: boolean;
  onAfterUserMoreAction?: () => Promise<void>;
}

function UpdatedFriendItemDefault({
  user,
  isMyPage,
  showMoreButton,
  onAfterUserMoreAction,
}: Props) {
  const { id, profile_image, username, unread_chat_count, description } = user;

  const { featureFlags } = useBoundStore(UserSelector);
  const isVerQ = !!featureFlags?.postsVerQ;

  const [showMoreModal, setShowMoreModal] = useState(false);

  const navigate = useNavigate();
  const handleClickProfile = () => {
    navigate(`/users/${username}`);
  };

  const handleClickChat = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`/users/${id}/chat`);
  };

  const handleClickMore = (e: MouseEvent) => {
    e.stopPropagation();
    setShowMoreModal(true);
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
              </Layout.FlexRow>
              {description && (
                <Typo type="label-medium" color="MEDIUM_GRAY" numberOfLines={1}>
                  {description}
                </Typo>
              )}
            </Layout.FlexCol>
          </Layout.FlexRow>
        </StyledProfileArea>
        {isMyPage && (
          <Layout.FlexRow w="100%" justifyContent="flex-end" alignItems="center" gap={8}>
            <Layout.LayoutBase pb={2} style={{ position: 'relative' }}>
              <Icon
                name={isVerQ ? 'friend_item_chat' : 'chat_send'}
                size={22}
                onClick={handleClickChat}
              />
              {unread_chat_count > 0 && (
                <Layout.Absolute
                  bgColor="SECONDARY"
                  alignItems="center"
                  rounded={10}
                  t={-3}
                  r={-6}
                  ph={3}
                  pv={1}
                >
                  <Typo type="label-small" color="BLACK" fontSize={7} fontWeight={700}>
                    {unread_chat_count > 99 ? '99+' : unread_chat_count}
                  </Typo>
                </Layout.Absolute>
              )}
            </Layout.LayoutBase>
            {showMoreButton && <Icon name="dots_menu" size={22} onClick={handleClickMore} />}
          </Layout.FlexRow>
        )}
      </StyledUpdatedFriendItem>
      {showMoreButton && (
        <UserMoreModal
          isVisible={showMoreModal}
          setIsVisible={setShowMoreModal}
          user={user as unknown as UserProfile}
          callback={onAfterUserMoreAction}
        />
      )}
    </Layout.FlexRow>
  );
}

export default UpdatedFriendItemDefault;
