import { Moment } from '@models/moment';
import { SliceStateCreator } from './useBoundStore';

interface MomentState {
  todayMoment: Moment;
}
interface MomentAction {
  fetchTodayMoment: () => Promise<void>;
}

const initialState = {
  todayMoment: {
    mood: null,
    photo: null,
    description: null,
  },
};

export type MomentSlice = MomentState & MomentAction;

export const createMomentSlice: SliceStateCreator<MomentSlice> = (set) => ({
  ...initialState,
  fetchTodayMoment: async () => {
    // 실제 배포되기 전까지 일단 주석처리
    // const moment = await getTodayMoment();
    set(() => ({ todayMoment: initialState }));
  },
});
