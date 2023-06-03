import { useParams } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import TitleHeader from '@components/title-header/TitleHeader';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';

// 주관식: 하나의 질문
// 객관식: 여러개의 질문
function QuestionDetail() {
  const { questionId } = useParams();

  // questionId로 질문 상세 가져와서 보여주기
  // 내가 작성한 답변도 있다면 보여줘야 함
  console.log(questionId);

  return (
    <MainContainer>
      <TitleHeader />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 14} w="100%" ph={DEFAULT_MARGIN} gap={20}>
        {/* 질문 아이템 */}
        {/* 이전 답변들 */}
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default QuestionDetail;
