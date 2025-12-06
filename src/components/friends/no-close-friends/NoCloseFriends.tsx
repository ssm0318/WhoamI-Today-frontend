import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Layout, Typo } from '@design-system';
import SelectCloseFriendsBottomSheet from '../select-close-friends-bottom-sheet/SelectCloseFriendsBottomSheet';
import { Container, DescriptionText, EmojiContainer } from './NoCloseFriends.styled';

function NoCloseFriends() {
  const [t] = useTranslation('translation', { keyPrefix: 'friends.list.no_friends' });
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const handleAddClick = () => {
    setIsBottomSheetVisible(true);
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetVisible(false);
  };

  return (
    <>
      <Container ph={75} pv={40} gap={16} alignItems="center">
        <EmojiContainer>👀</EmojiContainer>
        <Layout.FlexCol gap={8} alignItems="center">
          <Typo type="title-medium" color="BLACK">
            {t('close_friends_title')}
          </Typo>
          <DescriptionText type="body-medium" color="MEDIUM_GRAY">
            {t('close_friends_description')}
          </DescriptionText>
        </Layout.FlexCol>
        <Button.Primary
          status="normal"
          text={t('add_now')}
          onClick={handleAddClick}
          sizing="stretch"
        />
      </Container>
      {isBottomSheetVisible && (
        <SelectCloseFriendsBottomSheet
          visible={isBottomSheetVisible}
          closeBottomSheet={handleCloseBottomSheet}
        />
      )}
    </>
  );
}

export default NoCloseFriends;
