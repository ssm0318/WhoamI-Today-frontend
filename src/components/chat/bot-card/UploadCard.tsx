import React, { useCallback, useRef, useState } from 'react';

import * as S from './UploadCard.styled';

interface Props {
  context?: string;
  label?: string;
  disabled?: boolean;
  onSubmit: (file: File) => void;
}

function UploadCard({ context, label, disabled, onSubmit }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleClick = useCallback(() => {
    if (submitted || disabled) return;
    inputRef.current?.click();
  }, [submitted, disabled]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setSubmitted(true);
      onSubmit(file);
      if (inputRef.current) inputRef.current.value = '';
    },
    [onSubmit],
  );

  return (
    <S.Container>
      <S.UploadButton type="button" disabled={submitted || disabled} onClick={handleClick}>
        {submitted ? 'Uploaded ✓' : label || 'Upload screenshot'}
      </S.UploadButton>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleChange}
        data-context={context}
      />
    </S.Container>
  );
}

export default UploadCard;
