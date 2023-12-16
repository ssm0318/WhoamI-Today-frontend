import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Font, Layout, SvgIcon } from '@design-system';
import { friendList as mockFriendList } from '@mock/friends';
import { User } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { getFriendList } from '@utils/apis/user';
import CheckInSection from '../check-in/CheckIn';
import FriendsInfo from './friends-info/FriendsInfo';

interface ProfileProps {
  user?: User;
}

function Profile({ user }: ProfileProps) {
  const [friendList, setFriendList] = useState<User[]>(mockFriendList);
  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));
  const isMyPage = user?.id === myProfile?.id;

  const { username } = useParams();
  const navigate = useNavigate();

  const fetchFriends = useCallback(async (_next?: string | null) => {
    const { results = [] } = await getFriendList(_next);
    setFriendList((prev) => (_next ? (prev ? [...prev, ...results] : []) : results));
  }, []);

  const handleClickEditProfile = () => {
    return navigate('/settings/edit-profile');
  };

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  if (!user) return null;

  return (
    <Layout.FlexCol gap={8}>
      <Layout.FlexRow gap={8}>
        <ProfileImage imageUrl={myProfile?.profile_image} username={username} size={80} />
        <Layout.FlexCol gap={8}>
          <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
            <Font.Body type="20_semibold">{isMyPage ? myProfile?.username : username}</Font.Body>
            {isMyPage && <SvgIcon name="edit_outline" size={24} onClick={handleClickEditProfile} />}
          </Layout.FlexRow>
          {/* bio */}
          <Font.Body type="14_regular" numberOfLines={2}>
            I’m a Bio! Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit ame.
          </Font.Body>
        </Layout.FlexCol>
      </Layout.FlexRow>
      {/* 친구 목록 */}
      <FriendsInfo friends={friendList} />
      <CheckInSection user={user} />
    </Layout.FlexCol>
  );
}

export default Profile;
