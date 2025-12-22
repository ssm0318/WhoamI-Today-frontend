import { useState } from 'react';
import { Button } from '@design-system';
import * as S from './HighlightSection.styled';

function HighlightSection() {
  const [content, setContent] = useState<string>('');

  const handleSave = () => {
    // TODO: 실제 저장 로직 구현
  };

  const handleShare = () => {
    // TODO: 실제 공유 로직 구현
  };

  return (
    <S.HighlightSectionWrapper>
      <S.Title>What are your two truths and a lie</S.Title>

      <S.TextInputWrapper>
        <S.StyledTextArea
          placeholder="For eg:
1. I can run a 10K without stopping.
2. I once ate 22 momos in a single sitting.
3. I've been banned from Costco for life."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </S.TextInputWrapper>

      <S.ButtonContainer>
        <Button.Secondary
          text="Save to your Profile"
          sizing="stretch"
          onClick={handleSave}
          status="normal"
        />
        <Button.Primary
          text="Share as a post"
          sizing="stretch"
          onClick={handleShare}
          status="normal"
        />
      </S.ButtonContainer>
    </S.HighlightSectionWrapper>
  );
}

export default HighlightSection;
