import { DailyQuestion } from '@models/post';
import { getTodayQuestions } from '@utils/apis/question';
import { sliceResetFns } from './resetSlices';
import { BoundState, SliceStateCreator } from './useBoundStore';

interface TodaysQuestionsState {
  todaysQuestions: DailyQuestion[] | undefined;
}
interface TodaysQuestionsAction {
  fetchTodaysQuestions: () => Promise<void>;
}

const initialState = {
  todaysQuestions: [],
};

export type TodaysQuestionsSlice = TodaysQuestionsState & TodaysQuestionsAction;

export const createTodaysQuestionsSlice: SliceStateCreator<TodaysQuestionsSlice> = (set) => {
  sliceResetFns.add(() => set(initialState));
  return {
    ...initialState,
    fetchTodaysQuestions: async () => {
      const todaysQuestions = await getTodayQuestions();
      set(() => ({
        todaysQuestions,
      }));
    },
  };
};

export const TodayQuestionsSelector = (state: BoundState) => ({
  todaysQuestions: state.todaysQuestions,
  fetchTodaysQuestions: state.fetchTodaysQuestions,
});
