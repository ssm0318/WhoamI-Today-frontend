import { CSSProperties, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { BottomMenuDialog } from '@components/_common/alert-dialog/bottom-menu-dialog/BottomMenuDialog';
import CommonDialog from '@components/_common/alert-dialog/common-dialog/CommonDialog';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import { DEFAULT_MARGIN } from '@constants/layout';
import { Colors, Layout, Typo } from '@design-system';
import { CheckInPostStory, CheckInPostVisibility } from '@models/checkInPost';

interface SnippetMoreModalProps {
  snippet: CheckInPostStory | null;
  onClose: () => void;
  onDelete: (snippet: CheckInPostStory) => Promise<void> | void;
  onChangeVisibility: (snippet: CheckInPostStory, v: CheckInPostVisibility) => Promise<void> | void;
}

const VISIBILITY_OPTIONS: { value: CheckInPostVisibility; label: string }[] = [
  { value: 'friends', label: 'Friends' },
  { value: 'close_friends', label: 'Close Friends' },
];

function SnippetMoreModal({
  snippet,
  onClose,
  onDelete,
  onChangeVisibility,
}: SnippetMoreModalProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'check_in_post' });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showVisibility, setShowVisibility] = useState(false);
  const [selected, setSelected] = useState<CheckInPostVisibility>('friends');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (snippet) setSelected(snippet.visibility);
  }, [snippet]);

  const closeAll = () => {
    setConfirmDelete(false);
    setShowVisibility(false);
    onClose();
  };

  const handleDelete = () => setConfirmDelete(true);

  const handleConfirmDelete = async () => {
    if (!snippet) return;
    await onDelete(snippet);
    closeAll();
  };

  const handleModify = () => {
    setShowVisibility(true);
    onClose();
  };

  const handleSaveVisibility = async () => {
    if (!snippet || saving) return;
    setSaving(true);
    try {
      await onChangeVisibility(snippet, selected);
    } finally {
      setSaving(false);
      setShowVisibility(false);
    }
  };

  return (
    <>
      <BottomMenuDialog
        visible={snippet !== null && !confirmDelete && !showVisibility}
        onClickClose={onClose}
      >
        {snippet?.is_pinned && (
          <MenuRow onClick={handleModify}>
            <Typo type="button-large" color="DARK">
              {t('modify_visibility')}
            </Typo>
          </MenuRow>
        )}
        <MenuRow onClick={handleDelete}>
          <Typo type="button-large" color="WARNING">
            {t('delete')}
          </Typo>
        </MenuRow>
      </BottomMenuDialog>

      <CommonDialog
        visible={confirmDelete}
        title={t('delete_title')}
        content={t('delete_content')}
        cancelText={t('delete_cancel')}
        confirmText={t('delete_confirm')}
        confirmTextColor="WARNING"
        onClickClose={closeAll}
        onClickConfirm={handleConfirmDelete}
      />

      <BottomModal visible={showVisibility} onClose={() => setShowVisibility(false)}>
        <Layout.FlexCol w="100%" p={DEFAULT_MARGIN} gap={16}>
          <Typo type="title-medium" color="DARK">
            {t('visibility_modal_title')}
          </Typo>
          <Layout.FlexCol w="100%" gap={8}>
            <Typo type="label-medium" color="MEDIUM_GRAY">
              {t('visibility_label')}
            </Typo>
            <ToggleRow>
              {VISIBILITY_OPTIONS.map((opt) => (
                <ToggleChip
                  key={opt.value}
                  type="button"
                  $selected={selected === opt.value}
                  onClick={() => setSelected(opt.value)}
                >
                  <Typo
                    type="label-large"
                    color={selected === opt.value ? 'PRIMARY' : 'MEDIUM_GRAY'}
                    fontWeight={selected === opt.value ? 600 : 400}
                  >
                    {opt.label}
                  </Typo>
                </ToggleChip>
              ))}
            </ToggleRow>
          </Layout.FlexCol>
          <Layout.FlexRow w="100%" justifyContent="flex-end" gap={8}>
            <button
              type="button"
              onClick={() => setShowVisibility(false)}
              style={cancelBtnStyle}
              disabled={saving}
            >
              <Typo type="button-medium" color="DARK_GRAY">
                {t('cancel')}
              </Typo>
            </button>
            <button
              type="button"
              onClick={handleSaveVisibility}
              style={saveBtnStyle}
              disabled={saving}
            >
              <Typo type="button-medium" color="WHITE">
                {t('confirm')}
              </Typo>
            </button>
          </Layout.FlexRow>
        </Layout.FlexCol>
      </BottomModal>
    </>
  );
}

function MenuRow({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <Layout.LayoutBase
      as="button"
      type="button"
      onClick={onClick}
      w="100%"
      pv={14}
      ph={16}
      style={{
        border: 'none',
        borderBottom: `1px solid ${Colors.LIGHT_GRAY}`,
        background: 'transparent',
        textAlign: 'center',
        cursor: 'pointer',
      }}
    >
      {children}
    </Layout.LayoutBase>
  );
}

const ToggleRow = styled.div`
  display: flex;
  gap: 4px;
  background-color: ${({ theme }) => theme.BACKGROUND_COLOR};
  border-radius: 8px;
  padding: 2px;
`;

const ToggleChip = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${({ $selected, theme }) => ($selected ? theme.WHITE : 'transparent')};
  border: 1px solid ${({ $selected, theme }) => ($selected ? theme.PRIMARY : 'transparent')};
  transition: all 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
`;

const cancelBtnStyle: CSSProperties = {
  borderRadius: 8,
  padding: '6px 14px',
  background: Colors.WHITE,
  border: `1px solid ${Colors.LIGHT_GRAY}`,
  cursor: 'pointer',
};

const saveBtnStyle: CSSProperties = {
  borderRadius: 8,
  padding: '6px 14px',
  background: Colors.PRIMARY,
  border: 'none',
  cursor: 'pointer',
};

export default SnippetMoreModal;
