import { useEffect, useState } from 'react';
import { StyledTranslationButton } from '@components/_common/content-translation/ContentTranslation.styled';
import { Typo } from '@design-system';
import i18n from '@i18n/index';
import { requestTranslateText } from '@utils/apis/translate';

interface Props {
  content: string;
  useTranslation?: boolean;
}

export default function ContentTranslation({ content, useTranslation = true }: Props) {
  const [translatedContent, setTranslatedContent] = useState('');
  const [showTranslationBtn, setShowTranslationBtn] = useState(false);
  const [showTranslatedText, setShowTranslatedText] = useState(false);

  useEffect(() => {
    if (!content || !useTranslation) return;
    requestTranslateText(content, i18n.language)
      .then(({ data }) => {
        setShowTranslationBtn(
          data.detectedSourceLanguage !== i18n.language && data.translatedText !== content,
        );
        setTranslatedContent(data.translatedText);
      })
      .catch(() => {
        setTranslatedContent('');
      });
  }, [content, useTranslation]);

  const toggleTranslateText = () => {
    setShowTranslatedText((prev) => !prev);
  };

  return (
    <>
      <Typo type="body-large" color="BLACK" pre>
        {showTranslatedText ? translatedContent : content}
      </Typo>
      {!!translatedContent && showTranslationBtn && (
        <StyledTranslationButton
          fontType="body-medium"
          status="normal"
          text={showTranslatedText ? '원문보기' : '번역보기'}
          onClick={toggleTranslateText}
        />
      )}
    </>
  );
}
