import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyledTranslationButton } from '@components/_common/content-translation/ContentTranslation.styled';
import { Typo } from '@design-system';
import i18n from '@i18n/index';
import { requestTranslateText } from '@utils/apis/translate';

interface Props {
  content: string;
  translateContent?: boolean;
}

export default function ContentTranslation({ content, translateContent = true }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'translation' });
  const [translatedContent, setTranslatedContent] = useState('');
  const [showTranslationBtn, setShowTranslationBtn] = useState(false);
  const [showTranslatedText, setShowTranslatedText] = useState(false);

  useEffect(() => {
    if (!content || !translateContent) return;
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
  }, [content, translateContent]);

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
          text={showTranslatedText ? t('see_original') : t('see_translation')}
          onClick={toggleTranslateText}
        />
      )}
    </>
  );
}
