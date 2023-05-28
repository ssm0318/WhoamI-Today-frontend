import { shortAnswerQuestions } from '@mock/questions';
import { ShortAnswerQuestion } from '@models/post';
import { SliceStateCreator } from './useBoundStore';

interface TodaysQuestionsState {
  shortAnswerQuestions: ShortAnswerQuestion[];
}
interface TodaysQuestionsAction {
  fetchTodaysQuestions: () => Promise<void>;
}

const initialState = {
  shortAnswerQuestions: [],
};

export type TodaysQuestionsSlice = TodaysQuestionsState & TodaysQuestionsAction;

export const createTodaysQuestionsSlice: SliceStateCreator<TodaysQuestionsSlice> = (set) => ({
  ...initialState,
  fetchTodaysQuestions: async () => {
    set(() => ({
      shortAnswerQuestions,
    }));
  },
});
