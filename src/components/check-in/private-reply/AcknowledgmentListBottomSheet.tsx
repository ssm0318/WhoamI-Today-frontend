import { CSSProperties, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { SCREEN_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import { AcknowledgmentUser, getAcknowledgments } from '@utils/apis/privateReply';

interface Props {
  entryId: number;
  onClose: () => void;
}

function AcknowledgmentListBottomSheet({ entryId, onClose }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [users, setUsers] = useState<AcknowledgmentUser[]>([]);

  useEffect(() => {
    getAcknowledgments(entryId)
      .then((data) => setUsers(data))
      .catch(() => setUsers([]));
  }, [entryId]);

  const handleClickUser = (username: string) => {
    onClose();
    navigate(`/users/${username}`);
  };

  return createPortal(
    <BottomModal visible onClose={onClose} draggable customHeight={Math.round(SCREEN_HEIGHT * 0.4)}>
      <div style={{ width: '100%', backgroundColor: '#FCFCFC', borderBottom: '1px solid #F0F0F0' }}>
        <Layout.FlexRow w="100%" h={44} alignItems="center" justifyContent="center">
          <Typo type="title-medium" bold>
            {t('private_reply.acknowledgments_title')}
          </Typo>
        </Layout.FlexRow>
      </div>
      <Layout.FlexCol w="100%" p={16} gap={4}>
        {users.length === 0 ? (
          <Layout.FlexRow w="100%" justifyContent="center" pv={24}>
            <Typo type="body-medium" color="MEDIUM_GRAY">
              {t('private_reply.no_acknowledgments')}
            </Typo>
          </Layout.FlexRow>
        ) : (
          users.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => handleClickUser(user.username)}
              style={userRowStyle}
            >
              <ProfileImage imageUrl={user.profile_image} username={user.username} size={36} />
              <Typo type="title-medium">{user.username}</Typo>
            </button>
          ))
        )}
      </Layout.FlexCol>
    </BottomModal>,
    document.getElementById('modal-container') || document.body,
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

export default AcknowledgmentListBottomSheet;
