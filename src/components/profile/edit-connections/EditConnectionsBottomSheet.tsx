import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import { Divider } from '@components/_common/divider/Divider.styled';
import { UserPageContext } from '@components/user-page/UserPage.context';
import { Button, CheckBox, Layout, RadioButton, Typo } from '@design-system';
import { useTrackEvent } from '@hooks/useTrackEvent';
import { Connection } from '@models/api/friends';
import { UserProfile } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { changeConnection } from '@utils/apis/friends';

interface Props {
  user: UserProfile;
  visible: boolean;
  closeBottomSheet: () => void;
  onConnectionChanged?: (connection: Connection) => void;
}

function EditConnectionsBottomSheet({
  user,
  visible,
  closeBottomSheet,
  onConnectionChanged,
}: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'user_page' });
  const { updateUser } = useContext(UserPageContext);
  const { featureFlags } = useBoundStore(UserSelector);

  const [connection, setConnection] = useState<Connection>(
    user?.connection_status ?? Connection.FRIEND,
  );
  const isChanged = connection !== user?.connection_status;
  const trackEvent = useTrackEvent();
  const beforeConnectionRef = useRef<Connection | null>(null);
  const savedRef = useRef(false);

  const handleChangeConnection = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value as Connection;
    // Each radio toggle is its own signal — backend only sees the final
    // saved state, not the back-and-forth.
    trackEvent('edit_connections_changed', {
      friend_id: user.id,
      from: String(connection),
      to: String(next),
    });
    setConnection(next);
  };

  const [isUpdatePastPosts, setIsUpdatePastPosts] = useState(false);

  const handleChangeCheckBox = () => {
    setIsUpdatePastPosts((prev) => !prev);
  };

  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));

  const handleClickEdit = () => {
    changeConnection(user.id, {
      choice: connection,
      update_past_posts: featureFlags?.postsVerQ ? true : isUpdatePastPosts,
    })
      .then(() => {
        savedRef.current = true;
        // Backend HAS the final connection state via this API call, but
        // the saved event is still useful as a funnel terminal: paired
        // with _opened it gives us the conversion rate (opened → saved
        // vs opened → dismissed).
        trackEvent('edit_connections_saved', {
          friend_id: user.id,
          from: String(beforeConnectionRef.current ?? ''),
          to: String(connection),
        });
        closeBottomSheet();
        updateUser?.();
        onConnectionChanged?.(connection);
        openToast({ message: t('edit_connections.toast.success') });
      })
      .catch(() => {
        closeBottomSheet();
        openToast({ message: t('edit_connections.toast.error') });
      });
  };

  useEffect(() => {
    if (visible) {
      const initial = user?.connection_status ?? Connection.FRIEND;
      setConnection(initial);
      setIsUpdatePastPosts(false);
      beforeConnectionRef.current = initial;
      savedRef.current = false;
      trackEvent('edit_connections_opened', {
        friend_id: user.id,
        current: String(initial),
      });
    } else if (beforeConnectionRef.current !== null && !savedRef.current) {
      // Closed without save. had_changes lets us tell "considered then
      // backed out" from "opened, did nothing, closed".
      trackEvent('edit_connections_dismissed', {
        friend_id: user.id,
        had_changes: connection !== beforeConnectionRef.current ? 'true' : 'false',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, user?.connection_status]);

  useEffect(() => {
    // FRIEND 관계일 때 이전 게시글 업데이트 체크박스 비활성화
    if (connection === Connection.FRIEND) {
      setIsUpdatePastPosts(false);
    }
  }, [connection]);

  return createPortal(
    <BottomModal visible={visible} onClose={closeBottomSheet}>
      <Layout.FlexCol justifyContent="space-between" w="100%" p={10} gap={4} bgColor="WHITE">
        <Layout.FlexRow justifyContent="center" w="100%">
          <Typo type="title-large">{t('edit_connections.title')}</Typo>
        </Layout.FlexRow>
        <Divider width={1} />
        <Layout.FlexCol pv={10} gap={10} w="100%">
          <Layout.FlexCol gap={3} w="100%" bgColor="LIGHT" p={10} rounded={12}>
            <Typo type="title-medium" mb={10}>
              {t('edit_connections.choice')}
            </Typo>
            <Layout.FlexCol justifyContent="flex-start" w="100%" gap={10}>
              <RadioButton
                label={t('connection.friend') || ''}
                name="connection_type"
                value={Connection.FRIEND}
                checked={connection === Connection.FRIEND}
                onChange={handleChangeConnection}
              />
              <RadioButton
                label={t('connection.close_friend') || ''}
                name="connection_type"
                value={Connection.CLOSE_FRIEND}
                checked={connection === Connection.CLOSE_FRIEND}
                onChange={handleChangeConnection}
              />
              {/* update_past_posts 체크박스: VER_W (friendList) 일 때만 노출, VER_Q 는 항상 true 강제 */}
              {featureFlags?.friendList && !featureFlags?.postsVerQ && (
                <Layout.FlexRow ml={30}>
                  <CheckBox
                    name={t('edit_connections.check_box') || ''}
                    onChange={handleChangeCheckBox}
                    checked={isUpdatePastPosts}
                    disabled={connection === Connection.FRIEND}
                  />
                </Layout.FlexRow>
              )}
            </Layout.FlexCol>
          </Layout.FlexCol>
        </Layout.FlexCol>
        <Button.Confirm
          text={t('edit_connections.save')}
          status={isChanged ? 'normal' : 'disabled'}
          sizing="stretch"
          onClick={handleClickEdit}
        />
      </Layout.FlexCol>
    </BottomModal>,
    document.getElementById('modal-container') || document.body,
  );
}

export default EditConnectionsBottomSheet;
