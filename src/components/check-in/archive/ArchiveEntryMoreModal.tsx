import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BottomMenuDialog } from '@components/_common/alert-dialog/bottom-menu-dialog/BottomMenuDialog';
import CommonDialog from '@components/_common/alert-dialog/common-dialog/CommonDialog';
import { Colors, Layout, Typo } from '@design-system';
import { CheckInComponentEntry } from '@models/checkInEntry';

interface Props {
  entry: CheckInComponentEntry | null;
  onClose: () => void;
  onModifyVisibility: (entry: CheckInComponentEntry) => void;
  onDelete: (entry: CheckInComponentEntry) => Promise<void> | void;
}

/**
 * `⋯` bottom-menu for an archive card.
 *
 * Two rows: `Modify visibility` and `Delete`. Modify visibility is
 * always offered because the user's mental model is "change who sees
 * this," regardless of whether the card is currently pinned. When the
 * caller receives a modify-visibility request on an unpinned entry,
 * it auto-pins first (which seeds pin_visibility from entry.visibility
 * server-side) and then opens the visibility modal — see
 * Archive.tsx::handleModifyVisibility. Delete is surfaced in WARNING
 * red and opens a CommonDialog for confirmation; only archived rows
 * can be deleted server-side, which the backend enforces with a 400
 * on live entries (in practice this menu never opens for live rows
 * because they don't appear in the archive feed at all).
 */
function ArchiveEntryMoreModal({ entry, onClose, onModifyVisibility, onDelete }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'archive.more_modal' });
  const [tConfirm] = useTranslation('translation', { keyPrefix: 'archive.delete_confirm' });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const closeAll = () => {
    setConfirmDelete(false);
    onClose();
  };

  const handleClickModify = () => {
    if (!entry) return;
    onModifyVisibility(entry);
    onClose();
  };

  const handleClickDelete = () => {
    setConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (!entry) return;
    await onDelete(entry);
    closeAll();
  };

  return (
    <>
      <BottomMenuDialog visible={entry !== null && !confirmDelete} onClickClose={onClose}>
        {entry?.is_pinned && (
          <MenuRow onClick={handleClickModify}>
            <Typo type="button-large" color="DARK">
              {t('modify_visibility')}
            </Typo>
          </MenuRow>
        )}
        <MenuRow onClick={handleClickDelete}>
          <Typo type="button-large" color="WARNING">
            {t('delete')}
          </Typo>
        </MenuRow>
      </BottomMenuDialog>

      <CommonDialog
        visible={confirmDelete}
        title={tConfirm('title')}
        content={tConfirm('content')}
        cancelText={tConfirm('cancel')}
        confirmText={tConfirm('confirm')}
        confirmTextColor="WARNING"
        onClickClose={closeAll}
        onClickConfirm={handleConfirmDelete}
      />
    </>
  );
}

// Lightweight row — BottomMenuDialog provides the rounded panel shell.
function MenuRow({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <Layout.LayoutBase
      as="button"
      type="button"
      onClick={onClick}
      w="100%"
      pv={14}
      ph={16}
      justifyContent="center"
      alignItems="center"
      style={{
        border: 'none',
        borderBottom: `1px solid ${Colors.LIGHT_GRAY}`,
        background: 'transparent',
        cursor: 'pointer',
      }}
    >
      {children}
    </Layout.LayoutBase>
  );
}

export default ArchiveEntryMoreModal;
