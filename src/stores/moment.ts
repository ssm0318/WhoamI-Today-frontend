import { Moment } from '@models/moment';
import { getTodayMoment } from '@utils/apis/moment';
import { SliceStateCreator } from './useBoundStore';

interface MomentState {
  moment: Moment;
}
interface MomentAction {
  fetch: () => Promise<void>;
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
  fetch: async () => {
    const moment = await getTodayMoment();
    set(() => ({ moment }));
  },
});
