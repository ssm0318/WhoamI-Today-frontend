import { Moment } from '@models/moment';
import { SliceStateCreator } from './useBoundStore';

interface MomentState {
  moment: Moment;
}
interface MomentAction {
  fetchMoment: () => Promise<void>;
}

const initialState = {
  moment: {
    mood: null,
    photo: null,
    description: null,
  },
};

export type MomentSlice = MomentState & MomentAction;

export const createMomentSlice: SliceStateCreator<MomentSlice> = (set) => ({
  ...initialState,
  fetchMoment: async () => {
    // 실제 배포되기 전까지 일단 주석처리
    // const moment = await getTodayMoment();
    set(() => ({ moment: initialState }));
  },
});
