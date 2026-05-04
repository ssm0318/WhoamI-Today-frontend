import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ArchiveAfter24hToggle from '@components/check-in/archive-toggle/ArchiveAfter24hToggle';
import VisibilityToggle from '@components/check-in/visibility-toggle/VisibilityToggle';
import { Colors, Layout, SvgIcon, Typo } from '@design-system';
import { ComponentVisibility } from '@models/checkIn';
import { useBoundStore } from '@stores/useBoundStore';
import {
  getLastVisibility,
  setLastVisibility,
  VisibilityMemoryKeys,
} from '@utils/visibilityMemory';
import EditorPopup from './EditorPopup';

const MAX_LENGTH = 100;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onShare: (value: string, visibility: ComponentVisibility, archiveAfter24h: boolean) => void;
  value: string;
  onChange: (value: string) => void;
  visibility: ComponentVisibility;
  onVisibilityChange: (v: ComponentVisibility) => void;
  archiveAfter24h: boolean;
  onArchiveAfter24hChange: (next: boolean) => void;
}

export default function ThoughtEditor({
  isOpen,
  onClose,
  onShare,
  value,
  onChange,
  visibility,
  onVisibilityChange,
  archiveAfter24h,
  onArchiveAfter24hChange,
}: Props) {
  const [draftValue, setDraftValue] = useState<string>(value);
  const [draftVisibility, setDraftVisibility] = useState<ComponentVisibility>(
    () => getLastVisibility(VisibilityMemoryKeys.checkInThought) ?? visibility,
  );
  const [draftArchive, setDraftArchive] = useState<boolean>(archiveAfter24h);
  const openToast = useBoundStore((state) => state.openToast);

  // Snapshot of value/visibility/archive at popup open — used to skip the share
  // entirely when the user taps Confirm without changing anything.
  const initialValueRef = useRef<string>(value);
  const initialVisibilityRef = useRef<ComponentVisibility>(
    getLastVisibility(VisibilityMemoryKeys.checkInThought) ?? visibility,
  );
  const initialArchiveRef = useRef<boolean>(archiveAfter24h);

  const handleVisibilityChange = useCallback((v: ComponentVisibility) => {
    setDraftVisibility(v);
    setLastVisibility(VisibilityMemoryKeys.checkInThought, v);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const initialVis = getLastVisibility(VisibilityMemoryKeys.checkInThought) ?? visibility;
      setDraftValue(value);
      setDraftVisibility(initialVis);
      setDraftArchive(archiveAfter24h);
      initialValueRef.current = value;
      initialVisibilityRef.current = initialVis;
      initialArchiveRef.current = archiveAfter24h;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_LENGTH) {
      setDraftValue(e.target.value);
    }
  };

  const handleShare = useCallback(() => {
    if (
      draftValue === initialValueRef.current &&
      draftVisibility === initialVisibilityRef.current &&
      draftArchive === initialArchiveRef.current
    ) {
      openToast({ message: 'No changes' });
      onClose();
      return;
    }
    onChange(draftValue);
    onVisibilityChange(draftVisibility);
    onArchiveAfter24hChange(draftArchive);
    onShare(draftValue, draftVisibility, draftArchive);
  }, [
    draftValue,
    draftVisibility,
    draftArchive,
    onChange,
    onVisibilityChange,
    onArchiveAfter24hChange,
    onShare,
    onClose,
    openToast,
  ]);

  return (
    <EditorPopup isOpen={isOpen} onClose={onClose} onShare={handleShare} title="Be Random">
      <Layout.FlexCol w="100%" gap={8} mb={16}>
        <StyledTextArea
          value={draftValue}
          onChange={handleChange}
          placeholder="What's on your mind?"
          rows={3}
          maxLength={MAX_LENGTH}
        />
        <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
          {draftValue ? (
            <ClearButton type="button" onClick={() => setDraftValue('')}>
              <SvgIcon name="close" size={14} color="MEDIUM_GRAY" />
              <Typo type="label-medium" color="MEDIUM_GRAY">
                Clear
              </Typo>
            </ClearButton>
          ) : (
            <span />
          )}
          <Typo type="label-small" color="MEDIUM_GRAY">
            {draftValue.length}/{MAX_LENGTH}
          </Typo>
        </Layout.FlexRow>
      </Layout.FlexCol>
      <VisibilityToggle value={draftVisibility} onChange={handleVisibilityChange} />
      <ArchiveAfter24hToggle checked={draftArchive} onChange={setDraftArchive} />
    </EditorPopup>
  );
}

const ClearButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  padding: 4px 6px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: ${Colors.LIGHT};
  }
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  border: 1px solid ${Colors.LIGHT_GRAY};
  border-radius: 12px;
  padding: 12px;
  font-size: 16px;
  font-family: inherit;
  resize: none;
  outline: none;

  &:focus {
    border-color: ${Colors.PRIMARY};
  }

  &::placeholder {
    color: ${Colors.LIGHT_GRAY};
  }
`;
