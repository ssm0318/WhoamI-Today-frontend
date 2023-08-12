import { TodayMoment } from '@models/moment';
import { getTodayMoment } from '@utils/apis/moment';
import { SliceStateCreator } from './useBoundStore';

interface MomentState {
  todayMoment: TodayMoment;
  momentDraft: TodayMoment;
}
interface MomentAction {
  fetchTodayMoment: () => Promise<void>;
  setTodayMoment: (moment: Partial<TodayMoment>) => Promise<void>;
  setMomentDraft: (moment: Partial<TodayMoment>) => void;
  resetMomentDraft: () => void;
}

const initialState = {
  todayMoment: {
    mood: null,
    photo: null,
    description: null,
  },
  momentDraft: {
    mood: null,
    photo: null,
    description: null,
  },
};

export type MomentSlice = MomentState & MomentAction;

export const createMomentSlice: SliceStateCreator<MomentSlice> = (set) => ({
  ...initialState,
  fetchTodayMoment: async () => {
    const moment = await getTodayMoment();
    set(() => ({ todayMoment: moment || initialState }));
  },
  setTodayMoment: async (moment) => {
    set((state) => ({
      todayMoment: {
        ...state.todayMoment,
        ...moment,
      },
    }));
  },
  setMomentDraft: async (moment) => {
    set((state) => ({
      momentDraft: {
        ...state.momentDraft,
        ...moment,
      },
    }));
  },
  resetMomentDraft: async () => {
    set((state) => ({
      momentDraft: {
        ...state.todayMoment,
      },
    }));
  },
});
