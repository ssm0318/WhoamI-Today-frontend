import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Colors, SvgIcon, Typo } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';

function QuickShareInput() {
  const navigate = useNavigate();
  const [t] = useTranslation('translation');
  const myProfile = useBoundStore((state) => state.myProfile);

  const handleOpen = () => {
    navigate('/notes/new', { state: { fromShare: true } });
  };

  return (
    <CardWrapper
      onClick={handleOpen}
      role="button"
      aria-label={t('share_page.quick_share_aria') ?? undefined}
    >
      <ProfileImage imageUrl={myProfile?.profile_image} username={myProfile?.username} size={36} />
      <PlaceholderText type="body-medium" ellipsis={{ enabled: true }}>
        {t('notes.whats_on_your_mind')}
      </PlaceholderText>
      <SvgIcon name="chat_media_image" size={22} fill="DARK_GRAY" />
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 14px;
  border-radius: 14px;
  border: 2px solid #aeaeae;
  background-color: ${Colors.WHITE};
  cursor: pointer;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;

  &:active {
    background-color: ${Colors.LIGHT};
  }
`;

const PlaceholderText = styled(Typo)`
  flex: 1;
  min-width: 0;
  color: #808080;
`;

export default QuickShareInput;
