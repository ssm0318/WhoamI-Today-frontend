import { useTranslation } from 'react-i18next';
import { Layout, Typo } from '@design-system';
import { MainScrollContainer } from './Root';

function SuggestQuestions() {
  const [t] = useTranslation('translation', { keyPrefix: 'suggest_questions' });

  return (
    <MainScrollContainer>
      <Layout.FlexCol mt={50} w="100%" h="100%" ph={25} alignItems="center">
        <Typo type="head-line" mb={50} textAlign="center">
          {t('title')}
          <img
            src="/whoami-logo.svg"
            width="14px"
            alt="who_am_i"
            style={{
              marginLeft: 8,
            }}
          />
        </Typo>
        <Typo type="title-medium" pre>
          {t('description')}
        </Typo>
      </Layout.FlexCol>
    </MainScrollContainer>
  );
}

export default SuggestQuestions;
