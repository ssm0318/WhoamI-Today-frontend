import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ChatRoomList } from '@components/chats/chat-room-list/ChatRoomList';
import SubHeader from '@components/sub-header/SubHeader';
import { Layout, Typo } from '@design-system';
import { ModalContainer } from '@styles/wrappers';
import {
  EditChatsScrollContainer,
  StyledBottomArea,
  StyledDeleteButton,
  StyledMuteButton,
} from './EditChats.styled';

export function EditChats() {
  const [t] = useTranslation('translation', { keyPrefix: 'chats.edit_room_list' });

  const navigate = useNavigate();

  const handleClickCancel = () => {
    navigate('/chats');
  };

  const [checkList, setCheckList] = useState(new Set<number>());
  const checkListLength = checkList.size;
  const hasCheckList = checkListLength > 0;

  const handleClickCheckBox = (roomId: number) => {
    const isChecked = !checkList.has(roomId);
    if (isChecked) {
      setCheckList((prev) => {
        prev.add(roomId);
        return new Set(prev);
      });
    } else {
      setCheckList((prev) => {
        prev.delete(roomId);
        return new Set(prev);
      });
    }
  };

  const handleClickMute = () => {
    console.log('handle click mute');
  };

  const handleClickDelete = () => {
    console.log('handle click delete');
  };

  return (
    <ModalContainer>
      <SubHeader
        title={t('header.title')}
        RightComponent={
          <button type="button" onClick={handleClickCancel}>
            <Typo type="button-medium" color="PRIMARY">
              {t('header.cancel')}
            </Typo>
          </button>
        }
      />
      <EditChatsScrollContainer>
        <ChatRoomList isEditMode onClickCheckBox={handleClickCheckBox} checkList={checkList} />
      </EditChatsScrollContainer>
      <StyledBottomArea w="100%" b={0} pv={15} ph={8} bgColor="WHITE">
        <Layout.FlexRow w="100%" gap={5} justifyContent="center">
          <StyledMuteButton type="button" onClick={handleClickMute} disabled={!hasCheckList}>
            <Typo type="button-large">
              {[t('button.mute'), hasCheckList && `(${checkListLength})`].filter(Boolean).join(' ')}
            </Typo>
          </StyledMuteButton>
          <StyledDeleteButton type="button" onClick={handleClickDelete} disabled={!hasCheckList}>
            <Typo type="button-large">
              {[t('button.delete'), hasCheckList && `(${checkListLength})`]
                .filter(Boolean)
                .join(' ')}
            </Typo>
          </StyledDeleteButton>
        </Layout.FlexRow>
      </StyledBottomArea>
    </ModalContainer>
  );
}
