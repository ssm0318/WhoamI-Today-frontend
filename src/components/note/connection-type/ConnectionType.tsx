import { ChangeEvent } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import { Divider } from '@components/_common/divider/Divider.styled';
import { Button, Layout, RadioButton, Typo } from '@design-system';

interface Props {
  type: string;
  setType: (type: string) => void;
  visibilityUpdate: () => void;
  visible: boolean;
  closeBottomSheet: () => void;
}

function ConnectionType({ type, setType, visibilityUpdate, visible, closeBottomSheet }: Props) {
  const [t] = useTranslation('translation');

  const handleChangeConnection = (e: ChangeEvent<HTMLInputElement>) => {
    setType(e.target.value);
  };

  const handleConfirm = () => {
    visibilityUpdate();
    closeBottomSheet();
  };

  return createPortal(
    <BottomModal visible={visible} onClose={closeBottomSheet}>
      <Layout.FlexCol justifyContent="space-between" w="100%" p={10} gap={4} bgColor="WHITE">
        <Layout.FlexRow justifyContent="center" w="100%">
          <Typo type="title-large">{t('user_page.edit_connections.title')}</Typo>
        </Layout.FlexRow>
        <Divider width={1} />
        <Layout.FlexCol pv={10} gap={10} w="100%">
          <Layout.FlexCol gap={3} w="100%" bgColor="LIGHT" p={10} rounded={12}>
            <Typo type="title-medium" mb={10}>
              {t('user_page.edit_connections.choice')}
            </Typo>
            <Layout.FlexCol justifyContent="flex-start" w="100%" gap={10}>
              <RadioButton
                label={t('user_page.connection.friend') || ''}
                name="friends"
                value="friends"
                checked={type === 'friends'}
                onChange={handleChangeConnection}
              />
              <RadioButton
                label={t('user_page.connection.close_friend') || ''}
                name="close_friends"
                value="close_friends"
                checked={type === 'close_friends'}
                onChange={handleChangeConnection}
              />
            </Layout.FlexCol>
          </Layout.FlexCol>
        </Layout.FlexCol>

        <Button.Confirm
          text={t('user_page.edit_connections.save')}
          status={type ? 'normal' : 'disabled'}
          sizing="stretch"
          onClick={handleConfirm}
        />
      </Layout.FlexCol>
    </BottomModal>,
    document.getElementById('modal-container') || document.body,
  );
}

export default ConnectionType;
