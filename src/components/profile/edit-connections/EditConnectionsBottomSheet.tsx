import { ChangeEvent, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import { Divider } from '@components/_common/divider/Divider.styled';
import { UserPageContext } from '@components/user-page/UserPage.context';
import { Button, CheckBox, Layout, Typo } from '@design-system';
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

  const handleConfirmSave = () => {
    changeConnection(user.id, {
      choice: connection,
      update_past_posts: isUpdatePastPosts,
    })
      .then(() => {
        closeBottomSheet();
        updateUser();
        openToast({ message: 'Connection status updated' });
      })
      .catch(() => {
        closeBottomSheet();
        openToast({ message: 'Failed to update connection status' });
      });
  };

  return createPortal(
    <BottomModal visible={visible} onClose={closeBottomSheet}>
      <Layout.FlexCol
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        p={10}
        gap={4}
        bgColor="WHITE"
      >
        <Layout.FlexRow>
          <Typo type="title-large">Edit Connections</Typo>
        </Layout.FlexRow>
        <Divider width={1} />
        <Layout.FlexCol pv={10} gap={10}>
          <Layout.FlexRow gap={3}>
            <Typo type="label-large">Change to: </Typo>

            <label htmlFor={Connection.FRIEND}>
              {Connection.FRIEND}
              <input
                type="radio"
                name="connections"
                id={Connection.FRIEND}
                value={Connection.FRIEND}
                checked={connection === Connection.FRIEND}
                onChange={handleChangeConnection}
              />
            </label>
            <label htmlFor={Connection.CLOSE_FRIEND}>
              {Connection.CLOSE_FRIEND}
              <input
                type="radio"
                name="connections"
                id={Connection.CLOSE_FRIEND}
                value={Connection.CLOSE_FRIEND}
                checked={connection === Connection.CLOSE_FRIEND}
                onChange={handleChangeConnection}
              />
            </label>
          </Layout.FlexRow>
          <Layout.FlexRow>
            <CheckBox
              name="update past posts"
              onChange={handleChangeCheckBox}
              checked={isUpdatePastPosts}
            />
          </Layout.FlexRow>
        </Layout.FlexCol>

        <Button.Confirm
          text="Save"
          status={isChanged ? 'normal' : 'disabled'}
          sizing="stretch"
          onClick={handleConfirmSave}
        />
      </Layout.FlexCol>
    </BottomModal>,
    document.getElementById('modal-container') || document.body,
  );
}

export default EditConnectionsBottomSheet;
