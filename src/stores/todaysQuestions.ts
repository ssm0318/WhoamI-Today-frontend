import { ShortAnswerQuestion } from '@models/post';
import { getTodayQuestions } from '@utils/apis/todayQuestions';
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
    const todayQuestions = await getTodayQuestions();
    set(() => ({
      shortAnswerQuestions: todayQuestions,
    }));
  },
});
