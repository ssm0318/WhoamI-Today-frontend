import { Question, Response } from '@models/post';

export interface DaysQuestion {
  question: Question;
  responseList: Response[];
}

export const getDaysQuestionList = (responses: Response[]) => {
  return responses.reduce<DaysQuestion[]>((arr, response) => {
    const existedQuestion = arr.find(({ question }) => question.id === response.question_id);
    if (existedQuestion) {
      existedQuestion.responseList.push(response);
      return arr;
    }
    return [...arr, { question: response.question, responseList: [response] }];
  }, []);
};
