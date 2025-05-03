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
        </Typo>
        <Typo type="title-medium" pre>
          {t('description')}
        </Typo>
      </Layout.FlexCol>
    </MainScrollContainer>
  );
}

export default SuggestQuestions;
