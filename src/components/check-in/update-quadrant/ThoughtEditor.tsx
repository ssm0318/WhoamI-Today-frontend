import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import VisibilityToggle from '@components/check-in/visibility-toggle/VisibilityToggle';
import { Colors, Layout, Typo } from '@design-system';
import { ComponentVisibility } from '@models/checkIn';
import EditorPopup from './EditorPopup';

const MAX_LENGTH = 100;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onShare: () => void;
  value: string;
  onChange: (value: string) => void;
  visibility: ComponentVisibility;
  onVisibilityChange: (v: ComponentVisibility) => void;
}

export default function ThoughtEditor({
  isOpen,
  onClose,
  onShare,
  value,
  onChange,
  visibility,
  onVisibilityChange,
}: Props) {
  const [draftValue, setDraftValue] = useState<string>(value);
  const [draftVisibility, setDraftVisibility] = useState<ComponentVisibility>(visibility);

  useEffect(() => {
    if (isOpen) {
      setDraftValue(value);
      setDraftVisibility(visibility);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_LENGTH) {
      setDraftValue(e.target.value);
    }
  };

  const handleShare = useCallback(() => {
    onChange(draftValue);
    onVisibilityChange(draftVisibility);
    onShare();
  }, [draftValue, draftVisibility, onChange, onVisibilityChange, onShare]);

  return (
    <EditorPopup isOpen={isOpen} onClose={onClose} onShare={handleShare} title="Thought Snippet">
      <Layout.FlexCol w="100%" gap={8} mb={16}>
        <StyledTextArea
          value={draftValue}
          onChange={handleChange}
          placeholder="What's on your mind?"
          rows={3}
          maxLength={MAX_LENGTH}
        />
        <Layout.FlexRow w="100%" justifyContent="flex-end">
          <Typo type="label-small" color="MEDIUM_GRAY">
            {draftValue.length}/{MAX_LENGTH}
          </Typo>
        </Layout.FlexRow>
      </Layout.FlexCol>
      <VisibilityToggle value={draftVisibility} onChange={setDraftVisibility} />
    </EditorPopup>
  );
}

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
