import { CheckInForm, MyCheckIn } from '@models/checkIn';
import { getCheckInList } from '@utils/apis/checkIn';
import { sliceResetFns } from './resetSlices';
import { SliceStateCreator } from './useBoundStore';

interface CheckInState {
  checkIn: MyCheckIn | null;
  checkInForm: CheckInForm;
  checkInSaveHandler: (() => Promise<void>) | null;
  checkInSaving: boolean;
}
interface CheckInAction {
  fetchCheckIn: () => Promise<MyCheckIn | null>;
  setCheckInForm: (checkInForm: Partial<CheckInForm>) => void;
  setCheckInSaveHandler: (handler: (() => Promise<void>) | null) => void;
  setCheckInSaving: (saving: boolean) => void;
}

const initialState = {
  checkIn: null,
  checkInForm: {
    social_battery: null,
    bio: '',
    description: '',
    mood: '',
    track_id: '',
  },
  checkInSaveHandler: null as (() => Promise<void>) | null,
  checkInSaving: false,
};

export type CheckInSlice = CheckInState & CheckInAction;

export const createCheckInSlice: SliceStateCreator<CheckInSlice> = (set) => {
  sliceResetFns.add(() => set(initialState));
  return {
    ...initialState,
    fetchCheckIn: async () => {
      const { results: checkInList } = await getCheckInList();
      if (!checkInList || checkInList.length === 0) return null;
      const currentCheckIn = checkInList[0];
      set(() => ({
        checkIn: currentCheckIn,
      }));
      return currentCheckIn;
    },
    setCheckInForm: (checkInForm) =>
      set((state) => ({ checkInForm: { ...state.checkInForm, ...checkInForm } })),
    setCheckInSaveHandler: (handler) => set({ checkInSaveHandler: handler }),
    setCheckInSaving: (saving) => set({ checkInSaving: saving }),
  };
};
