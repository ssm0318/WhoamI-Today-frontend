import { multipleChoiceQuestions, shortAnswerQuestion } from '@mock/questions';
import { MultipleChoiceQuestion, ShortAnswerQuestion } from '@models/post';
import { SliceStateCreator } from './useBoundStore';

interface TodaysQuestionsState {
  shortAnswerQuestion: ShortAnswerQuestion | null;
  multipleChoiceQuestions: MultipleChoiceQuestion[];
}
interface TodaysQuestionsAction {
  fetchTodaysQuestions: () => Promise<void>;
}

const initialState = {
  shortAnswerQuestion: null,
  multipleChoiceQuestions: [],
};

export type TodaysQuestionsSlice = TodaysQuestionsState & TodaysQuestionsAction;

export const createTodaysQuestionsSlice: SliceStateCreator<TodaysQuestionsSlice> = (set) => ({
  ...initialState,
  fetchTodaysQuestions: async () => {
    set(() => ({
      shortAnswerQuestion,
      multipleChoiceQuestions,
    }));
  },
});
