import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Layout, Typo } from '@design-system';

const ROTATING_PLACEHOLDERS = [
  'What is on your mind right now?',
  'Share a random thought...',
  'Something you noticed today...',
  'A small win from today...',
  'What are you overthinking about?',
  'An unpopular opinion you have...',
  'Something you want to tell someone...',
  'A question you have been thinking about...',
  'What would you tell your past self?',
  'Something that surprised you recently...',
  'Your current mood in one sentence...',
  'A thought you have not shared yet...',
  'What keeps you up at night?',
  'Something you are grateful for...',
  'Your hot take of the day...',
];

function getRandomPlaceholder(): string {
  return ROTATING_PLACEHOLDERS[Math.floor(Math.random() * ROTATING_PLACEHOLDERS.length)];
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (content: string) => void;
}

function ThoughtSnippetInput({ visible, onClose, onSubmit }: Props) {
  const [text, setText] = useState('');
  const [placeholder] = useState(getRandomPlaceholder);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (visible) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setText('');
    }
  }, [visible]);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText('');
    onClose();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!visible) return null;

  return (
    <Overlay onClick={onClose}>
      <InputCard onClick={(e) => e.stopPropagation()}>
        <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center" pb={8}>
          <Typo type="title-medium">Thought Snippets</Typo>
          <button type="button" onClick={handleSubmit} disabled={!text.trim()}>
            <Typo type="title-medium" color={text.trim() ? 'PRIMARY' : 'LIGHT_GRAY'}>
              Post
            </Typo>
          </button>
        </Layout.FlexRow>
        <StyledTextarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={500}
          rows={4}
        />
        <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center" pt={4}>
          <Layout.FlexRow gap={4} alignItems="center">
            <Typo type="label-small" color="MEDIUM_GRAY">
              👥 Visible to friends only
            </Typo>
          </Layout.FlexRow>
          <Typo type="label-small" color="MEDIUM_GRAY">
            {text.length}/500
          </Typo>
        </Layout.FlexRow>
      </InputCard>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 120px;
  z-index: 1500;
  -webkit-tap-highlight-color: transparent;
`;

const InputCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 16px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  line-height: 24px;
  resize: none;
  font-family: inherit;
  color: #333;
  box-sizing: border-box;

  &::placeholder {
    color: #bdbdbd;
  }
`;

export default ThoughtSnippetInput;
