import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { LayoutBase } from 'src/design-system/layouts';

function NewResponse() {
  const { questionId } = useParams();
  const [t] = useTranslation('translation', { keyPrefix: 'question.response' });
  return (
    <MainContainer>
      <SubHeader title={t('new_response')} />
      <LayoutBase mt={TITLE_HEADER_HEIGHT} w="100%">
        <h1>{questionId}</h1>
      </LayoutBase>
    </MainContainer>
  );
}

export default NewResponse;
