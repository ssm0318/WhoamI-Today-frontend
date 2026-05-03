import { CSSProperties, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { SCREEN_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import { CheckInPostLike, getCheckInPostLikes } from '@utils/apis/checkInPost';

interface Props {
  postId: number | null;
  onClose: () => void;
}

function LikesListModal({ postId, onClose }: Props) {
  const navigate = useNavigate();
  const [likes, setLikes] = useState<CheckInPostLike[]>([]);

  useEffect(() => {
    if (!postId) {
      setLikes([]);
      return;
    }
    getCheckInPostLikes(postId)
      .then((data) => setLikes(data.results ?? []))
      .catch(() => setLikes([]));
  }, [postId]);

  const handleClickUser = (username: string) => {
    onClose();
    navigate(`/users/${username}`);
  };

  return (
    <BottomModal
      visible={postId !== null}
      onClose={onClose}
      draggable
      customHeight={Math.round(SCREEN_HEIGHT * 0.4)}
    >
      <div style={{ width: '100%', backgroundColor: '#FCFCFC', borderBottom: '1px solid #F0F0F0' }}>
        <Layout.FlexRow w="100%" h={44} alignItems="center" justifyContent="center">
          <Typo type="title-medium" bold>
            Likes
          </Typo>
        </Layout.FlexRow>
      </div>
      <Layout.FlexCol w="100%" p={16} gap={4}>
        {likes.length === 0 ? (
          <Layout.FlexRow w="100%" justifyContent="center" pv={24}>
            <Typo type="body-medium" color="MEDIUM_GRAY">
              No likes yet
            </Typo>
          </Layout.FlexRow>
        ) : (
          likes.map((like) => (
            <button
              key={like.id}
              type="button"
              onClick={() => handleClickUser(like.user_detail.username)}
              style={userRowStyle}
            >
              <ProfileImage
                imageUrl={like.user_detail.profile_image}
                username={like.user_detail.username}
                size={36}
              />
              <Typo type="title-medium">{like.user_detail.username}</Typo>
            </button>
          ))
        )}
      </Layout.FlexCol>
    </BottomModal>
  );
}

const userRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '8px 0',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  width: '100%',
  textAlign: 'left',
};

export default LikesListModal;
