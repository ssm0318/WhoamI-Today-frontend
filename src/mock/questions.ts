import { QUESTION_TYPE, ShortAnswerQuestion } from '@models/post';

export const shortAnswerQuestions: ShortAnswerQuestion[] = Array.from(
  { length: 15 },
  (_value, index) => ({
    id: index,
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
    type: QUESTION_TYPE.SHORT_ANSWER,
  }),
);

async function fetchQuestionAsync(questionId: number): Promise<ShortAnswerQuestion> {
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    id: questionId,
    content: `Question ${questionId}`,
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
    type: QUESTION_TYPE.SHORT_ANSWER,
  };
}

export async function fetchShortAnswerQuestionsAsync(
  questions: ShortAnswerQuestion[],
): Promise<ShortAnswerQuestion[]> {
  const result: ShortAnswerQuestion[] = [];

  for (let i = 0; i < questions.length; i += 15) {
    const chunk = questions.slice(i, i + 15);
    const promises = chunk.map(async (question) => {
      const data = await fetchQuestionAsync(question.id);
      return data;
    });

    // eslint-disable-next-line no-await-in-loop
    const chunkResult = await Promise.all(promises);
    result.push(...chunkResult);
  }

  return result;
}
