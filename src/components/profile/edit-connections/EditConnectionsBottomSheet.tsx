import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import { Divider } from '@components/_common/divider/Divider.styled';
import { UserPageContext } from '@components/user-page/UserPage.context';
import { Button, CheckBox, Layout, RadioButton, Typo } from '@design-system';
import { Connection } from '@models/api/friends';
import { UserProfile } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { changeConnection } from '@utils/apis/friends';

interface Props {
  user: UserProfile;
  visible: boolean;
  closeBottomSheet: () => void;
}

function EditConnectionsBottomSheet({ user, visible, closeBottomSheet }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'user_page' });
  const { updateUser } = useContext(UserPageContext);

  const [connection, setConnection] = useState<Connection>(
    user.connection_status ?? Connection.FRIEND,
  );
  const isChanged = connection !== user.connection_status;

  const handleChangeConnection = (e: ChangeEvent<HTMLInputElement>) => {
    setConnection(e.target.value as Connection);
  };

  const [isUpdatePastPosts, setIsUpdatePastPosts] = useState(false);

  const handleChangeCheckBox = () => {
    setIsUpdatePastPosts((prev) => !prev);
  };

  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));

  const handleClickEdit = () => {
    changeConnection(user.id, {
      choice: connection,
      update_past_posts: isUpdatePastPosts,
    })
      .then(() => {
        closeBottomSheet();
        updateUser();
        openToast({ message: t('edit_connections.toast.success') });
      })
      .catch(() => {
        closeBottomSheet();
        openToast({ message: t('edit_connections.toast.error') });
      });
  };

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
                name={Connection.FRIEND}
                value={Connection.FRIEND}
                checked={connection === Connection.FRIEND}
                onChange={handleChangeConnection}
              />
              <RadioButton
                label={t('connection.close_friend') || ''}
                name={Connection.CLOSE_FRIEND}
                value={Connection.CLOSE_FRIEND}
                checked={connection === Connection.CLOSE_FRIEND}
                onChange={handleChangeConnection}
              />
            </Layout.FlexCol>
          </Layout.FlexCol>
          <Layout.FlexRow>
            <CheckBox
              name={t('edit_connections.check_box') || ''}
              onChange={handleChangeCheckBox}
              checked={isUpdatePastPosts}
              disabled={connection === Connection.FRIEND}
            />
          </Layout.FlexRow>
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
