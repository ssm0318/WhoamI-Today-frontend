import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import { ToggleSwitch } from '@components/_common/toggle-switch/ToggleSwitch';
import { Font, Layout } from '@design-system';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function MessageNotiSettings({ visible, onClose }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'chat_room.noti_settings' });
  const [isMuted, setIsMuted] = useState(false);

  const handleToggle = () => {
    // TODO: 채팅방 뮤트 설정 변경
    setIsMuted((prev) => !prev);
  };

  return (
    <BottomModal visible={visible} onClose={onClose}>
      <Layout.LayoutBase bgColor="WHITE" w="100%">
        <Layout.FlexRow w="100%" justifyContent="center" pt={12}>
          <Font.Display type="18_bold">{t('title')}</Font.Display>
        </Layout.FlexRow>
        <Layout.FlexRow
          w="100%"
          pl={30}
          pt={18}
          pr={20}
          pb={21}
          justifyContent="space-between"
          alignItems="center"
        >
          <Font.Display type="14_regular">{t('mute')}</Font.Display>
          <ToggleSwitch type="small" checked={isMuted} onChange={handleToggle} />
        </Layout.FlexRow>
      </Layout.LayoutBase>
    </BottomModal>
  );
}
