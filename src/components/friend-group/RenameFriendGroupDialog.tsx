import { ChangeEvent, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Background, Container } from '@components/_common/alert-dialog/AlertDialog.styled';
import { Button, Font, Input, Layout } from '@design-system';
import { StyledRenameFriendGroupDialog } from './RenameFriendGroupDialog.styled';

interface RenameFriendGroupDialogProps {
  defaultGroupName?: string;
  visible: boolean;
  onClose: () => void;
}
function RenameFriendGroupDialog({
  defaultGroupName,
  visible,
  onClose,
}: RenameFriendGroupDialogProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'friend_group' });

  const isNewGroup = !defaultGroupName;

  const [newGroupNameInput, setNewGroupNameInput] = useState(defaultGroupName ?? '');

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setNewGroupNameInput(e.target.value);
  };

  const handleClickSaveChanges = () => {
    // TODO
  };

  const handleClickDismiss = () => {
    onClose();
  };

  if (!visible) return null;
  return createPortal(
    <Container>
      <Background onClick={onClose} />
      <StyledRenameFriendGroupDialog>
        <Font.Body type="20_semibold" color="BASIC_BLACK" textAlign="center" mb={6}>
          {isNewGroup ? t('add_group') : t('rename_group')}
        </Font.Body>
        <Font.Body type="14_regular" color="GRAY_3" textAlign="center" mb={13}>
          {t('rename_group_desc')}
        </Font.Body>
        <Input
          label={t('group_name')}
          name="group"
          value={newGroupNameInput}
          onChange={handleChangeInput}
          labelType="14_regular"
        />
        <Layout.FlexCol w="100%" mt={37} gap={6}>
          <Button.Medium
            type="secondary_fill"
            status="normal"
            text={t('save_changes')}
            sizing="stretch"
            onClick={handleClickSaveChanges}
          />
          <Button.Medium
            type="white_fill"
            status="normal"
            text={t('dismiss')}
            sizing="stretch"
            onClick={handleClickDismiss}
          />
        </Layout.FlexCol>
      </StyledRenameFriendGroupDialog>
    </Container>,
    document.body,
  );
}

export default RenameFriendGroupDialog;
