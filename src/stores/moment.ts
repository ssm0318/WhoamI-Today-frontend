import { TodayMoment } from '@models/moment';
import { getTodayMoment } from '@utils/apis/moment';
import { sliceResetFns } from './resetSlices';
import { SliceStateCreator } from './useBoundStore';

interface MomentState {
  todayMoment: TodayMoment;
}
interface MomentAction {
  fetchTodayMoment: () => Promise<TodayMoment>;
  setTodayMoment: (moment: Partial<TodayMoment>) => Promise<void>;
}

const initialState = {
  todayMoment: {
    mood: null,
    photo: null,
    description: null,
  },
};

export type MomentSlice = MomentState & MomentAction;

export const createMomentSlice: SliceStateCreator<MomentSlice> = (set) => {
  sliceResetFns.add(() => set(initialState));
  return {
    ...initialState,
    fetchTodayMoment: async () => {
      const moment = await getTodayMoment();
      const todayMoment: TodayMoment = {
        mood: moment?.mood || null,
        photo: moment?.photo || null,
        description: moment?.description || null,
      };
      set(() => ({
        todayMoment: todayMoment || initialState,
      }));
      return todayMoment;
    },
    setTodayMoment: async (moment) => {
      set((state) => ({
        todayMoment: {
          ...state.todayMoment,
          ...moment,
        },
      }));
    },
  };
};
