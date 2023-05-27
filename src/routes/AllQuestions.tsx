import MainContainer from '@components/_common/main-container/MainContainer';
import QuestionItem from '@components/question/question-item/QuestionItem';
import TitleHeader from '@components/title-header/TitleHeader';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import { POST_TYPE, Question } from '@models/post';

// TODO 나중에 mock data 제거
const questions: Question[] = [
  {
    id: 1,
    content: 'How does electricity work?',
    author: 'John Doe',
    author_detail: {
      id: 1,
      profile_image: null,
      profile_pic: 'https://example.com/profile_pic.jpg',
      url: 'https://example.com/profile/johndoe',
      username: 'johndoe',
    },
    like_count: 10,
    current_user_liked: false,
    created_at: '2023-05-26T10:30:00Z',
    share_with_friends: true,
    share_anonymously: false,
    type: POST_TYPE.QUESTION,
    selected_date: null,
    is_admin_question: false,
  },
  {
    id: 2,
    content: 'What are the benefits of exercise?',
    author: 'Jane Smith',
    author_detail: {
      id: 2,
      profile_image: null,
      profile_pic: 'https://example.com/profile_pic.jpg',
      url: 'https://example.com/profile/janesmith',
      username: 'janesmith',
    },
    like_count: 5,
    current_user_liked: true,
    created_at: '2023-05-25T15:45:00Z',
    share_with_friends: true,
    share_anonymously: true,
    type: POST_TYPE.QUESTION,
    selected_date: null,
    is_admin_question: false,
  },
  {
    id: 3,
    content: 'How to cook a perfect steak?',
    author: null,
    author_detail: {
      color_hex: '#FF0000',
    },
    like_count: null,
    current_user_liked: false,
    created_at: '2023-05-24T09:15:00Z',
    share_with_friends: true,
    share_anonymously: false,
    type: POST_TYPE.QUESTION,
    selected_date: null,
    is_admin_question: true,
  },
];

function AllQuestions() {
  return (
    <MainContainer>
      <TitleHeader title="Questions" />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 14} w="100%" ph={DEFAULT_MARGIN} gap={20}>
        {questions.map((question) => (
          <QuestionItem {...question} key={question.id} />
        ))}
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default AllQuestions;
