import { Emoji } from 'emoji-picker-react';
import { useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import SocialBatteryChip from '@components/profile/social-batter-chip/SocialBatteryChip';
import { Button, Layout, Typo } from '@design-system';
import { MyCheckIn } from '@models/checkIn';
import { useBoundStore } from '@stores/useBoundStore';
import { archiveLiveComponent } from '@utils/apis/checkIn';
import { getUnifiedEmoji } from '@utils/emojiHelpers';

interface CheckInFreshnessPromptProps {
  visible: boolean;
  onDismiss: () => void;
  checkIn: MyCheckIn | null;
}

function CheckInFreshnessPrompt({ visible, onDismiss, checkIn }: CheckInFreshnessPromptProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'check_in_freshness' });
  const navigate = useNavigate();
  const { fetchCheckIn, openToast } = useBoundStore((state) => ({
    fetchCheckIn: state.fetchCheckIn,
    openToast: state.openToast,
  }));

  const hasBattery = checkIn?.social_battery !== null && checkIn?.social_battery !== undefined;
  const hasMood = checkIn?.mood && checkIn.mood.length > 0;

  const handleConfirm = useCallback(() => {
    onDismiss();
  }, [onDismiss]);

  const handleUpdate = useCallback(() => {
    onDismiss();
    // Send users to the Check-In tab (`/update`) — the standalone
    // `/check-in/edit` page is deprecated and shouldn't be linked.
    navigate('/update');
  }, [onDismiss, navigate]);

  const handleClear = useCallback(async () => {
    try {
      if (hasBattery) {
        await archiveLiveComponent('battery');
      }
      if (hasMood) {
        await archiveLiveComponent('mood');
      }
      await fetchCheckIn();
      openToast({ message: t('cleared_toast') });
    } catch {
      // 실패 시 무시
    }
    onDismiss();
  }, [hasBattery, hasMood, fetchCheckIn, openToast, onDismiss, t]);

  return createPortal(
    <BottomModal visible={visible} onClose={onDismiss} draggable>
      <div style={{ width: '100%', backgroundColor: '#FCFCFC', borderBottom: '1px solid #F0F0F0' }}>
        <Layout.FlexRow w="100%" h={52} alignItems="center" justifyContent="center">
          <Typo type="title-large" bold>
            {t('title')}
          </Typo>
        </Layout.FlexRow>
      </div>
      <Layout.LayoutBase w="100%" bgColor="WHITE" pt={16} ph={24} pb={36}>
        <Layout.FlexRow gap={8} alignItems="center" mb={24}>
          {hasBattery && checkIn?.social_battery && (
            <SocialBatteryChip socialBattery={checkIn.social_battery} />
          )}
          {hasMood && (
            <Layout.FlexRow
              gap={2}
              alignItems="center"
              outline="LIGHT_GRAY"
              rounded={8}
              pv={4}
              ph={8}
            >
              {checkIn?.mood.map((emoji) => (
                <Emoji key={emoji} unified={getUnifiedEmoji(emoji)} size={18} lazyLoad />
              ))}
            </Layout.FlexRow>
          )}
        </Layout.FlexRow>
        <Layout.FlexCol gap={8} w="100%">
          <Button.Primary
            status="normal"
            text={t('confirm')}
            sizing="stretch"
            onClick={handleConfirm}
          />
          <Button.Secondary
            status="normal"
            text={t('update')}
            sizing="stretch"
            onClick={handleUpdate}
          />
          <Button.Tertiary
            status="normal"
            text={t('clear')}
            sizing="stretch"
            onClick={handleClear}
          />
        </Layout.FlexCol>
      </Layout.LayoutBase>
    </BottomModal>,
    document.getElementById('root-container') || document.body,
  );
}

export default CheckInFreshnessPrompt;
