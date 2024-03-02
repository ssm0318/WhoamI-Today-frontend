import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import { ChatRoomList } from '@components/chats/chat-room-list/ChatRoomList';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Button, Layout, Typo } from '@design-system';
import { StyledBottomArea } from './EditChats.styled';

export function EditChats() {
  const [t] = useTranslation('translation', { keyPrefix: 'chats.edit_room_list.header' });

  const navigate = useNavigate();

  const handleClickCancel = () => {
    navigate('/chats');
  };

  return (
    <MainContainer>
      <SubHeader
        title={t('title')}
        RightComponent={
          <button type="button" onClick={handleClickCancel}>
            <Typo type="button-medium" color="PRIMARY">
              {t('cancel')}
            </Typo>
          </button>
        }
      />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 8} w="100%">
        <ChatRoomList isEditMode />
      </Layout.FlexCol>
      <StyledBottomArea w="100%" b={0} pv={15} ph={8}>
        <Layout.FlexRow w="100%" gap={5}>
          <Button.Primary status="normal" text="Mute" sizing="stretch" />
          <Button.Primary status="normal" text="Delete" sizing="stretch" />
        </Layout.FlexRow>
      </StyledBottomArea>
    </MainContainer>
  );
}
