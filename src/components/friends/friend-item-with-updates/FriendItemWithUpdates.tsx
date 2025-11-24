import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import RecentPost from '@components/_common/recent-post/RecentPost';
import { Button, Layout, Typo } from '@design-system';
import { UpdatedProfile } from '@models/api/friends';
import { Note } from '@models/post';
import { Container, RecentPostConnector } from './FriendItemWithUpdates.styled';

interface Props {
  user: UpdatedProfile;
  recentPost?: Note;
  moreRentPosts?: boolean;
}

function FriendItemWithUpdates({ user, recentPost, moreRentPosts }: Props) {
  const { id, profile_image, username, current_user_read, unread_ping_count, description } = user;

  console.log('recentPost', recentPost);
  console.log('current_user_read', current_user_read);
  console.log('unread_ping_count', unread_ping_count);
  console.log('moreRentPosts', moreRentPosts);

  const [t] = useTranslation('translation', { keyPrefix: 'friend' });

  const navigate = useNavigate();
  const handleClickProfile = () => {
    navigate(`/users/${username}`);
  };

  const handleClickPing = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`/users/${id}/ping`);
  };

  return (
    <Layout.FlexCol w="100%" ph={16}>
      <Container
        w="100%"
        alignItems="center"
        justifyContent="space-between"
        onClick={handleClickProfile}
      >
        <Layout.FlexCol>
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
        </Layout.FlexCol>
        {/* 액션 버튼들 */}
        <Layout.FlexRow gap={10}>
          <Layout.FlexRow
            w="100%"
            style={{ position: 'relative' }}
            justifyContent="flex-end"
            alignItems="center"
            gap={3}
          >
            <Layout.LayoutBase pb={2}>
              <Icon name="friend_item_chat" color="BLACK" size={20} onClick={handleClickPing} />
            </Layout.LayoutBase>
            {unread_ping_count > 0 && (
              <Layout.Absolute
                bgColor="BLACK"
                alignItems="center"
                rounded={10}
                t={-3}
                r={6}
                ph={3}
                pv={1}
                tl={['100%', 0]}
              >
                <Typo type="label-small" color="WHITE" fontSize={7} fontWeight={700}>
                  {unread_ping_count > 99 ? '99+' : unread_ping_count}
                </Typo>
              </Layout.Absolute>
            )}
          </Layout.FlexRow>
          <Layout.FlexRow>
            <Icon name="dots_menu" color="BLACK" size={22} onClick={handleClickPing} />
          </Layout.FlexRow>
        </Layout.FlexRow>
      </Container>
      {/* recentPost가 있는 경우 보여줘야 함 */}
      {recentPost && (
        <>
          <RecentPostConnector />
          <RecentPost recentPost={recentPost} />
        </>
      )}
      {/* moreRentPosts가 있는 버튼 보여주기 */}
      {moreRentPosts && (
        <>
          <RecentPostConnector />
          {/* 더 많은 게시글 보기 */}
          <Button.Secondary
            text={t('view_all_updates_this_week')}
            status="normal"
            sizing="stretch"
          />
        </>
      )}
    </Layout.FlexCol>
  );
}

export default FriendItemWithUpdates;
