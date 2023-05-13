import { MomentData } from '@models/moment';
import { SliceStateCreator } from './useBoundStore';

interface MomentState extends MomentData {}
interface MomentAction {
  update: (data: MomentData) => void;
  reset: () => void;
}

const initialState: MomentState = {
  mood: null,
  photo: null,
  description: null,
};

export type MomentSlice = MomentState & MomentAction;

export const createMomentSlice: SliceStateCreator<MomentSlice> = (set) => ({
  ...initialState,
  update: (data: MomentData) =>
    set(
      (state: MomentState) => ({
        ...state,
        ...data,
      }),
      false,
      'moment/update',
    ),
  reset: () => set(initialState, false, 'moment/reset'),
});
