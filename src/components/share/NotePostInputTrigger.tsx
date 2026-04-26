import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Colors, Layout, SvgIcon, Typo } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';

function NotePostInputTrigger() {
  const [t] = useTranslation('translation');
  const navigate = useNavigate();
  const myProfile = useBoundStore((state) => state.myProfile);

  const handleClick = () => {
    navigate('/notes/new', { state: { fromShare: true } });
  };

  return (
    <Trigger type="button" onClick={handleClick}>
      <Layout.FlexRow w="100%" alignItems="center" gap={12}>
        <ProfileImage
          imageUrl={myProfile?.profile_image}
          username={myProfile?.username}
          size={40}
        />
        <Placeholder>
          <Typo type="body-large" color="MEDIUM_GRAY">
            {t('notes.whats_on_your_mind')}
          </Typo>
        </Placeholder>
        <SvgIcon name="chat_media_image" size={24} fill="DARK_GRAY" />
      </Layout.FlexRow>
    </Trigger>
  );
}

const Trigger = styled.button`
  width: 100%;
  padding: 12px 16px;
  border-radius: 16px;
  background-color: ${Colors.WHITE};
  border: 1px solid ${Colors.LIGHT};
  cursor: pointer;
  text-align: left;
  -webkit-tap-highlight-color: transparent;

  &:active {
    opacity: 0.8;
  }
`;

const Placeholder = styled.div`
  flex: 1;
  min-width: 0;
`;

export default NotePostInputTrigger;
