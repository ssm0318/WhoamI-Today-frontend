import { Availability, CheckInForm, MyCheckIn } from '@models/checkIn';
import { getCheckInList } from '@utils/apis/checkIn';
import { SliceStateCreator } from './useBoundStore';

interface CheckInState {
  checkIn: MyCheckIn | null;
  checkInForm: CheckInForm;
}
interface CheckInAction {
  fetchCheckIn: () => Promise<MyCheckIn | null>;
  setCheckInForm: (checkInForm: Partial<CheckInForm>) => void;
}

const initialState = {
  checkIn: null,
  checkInForm: {
    availability: Availability.available,
    bio: '',
    description: '',
    mood: '',
    track_id: '',
  },
};

export type CheckInSlice = CheckInState & CheckInAction;

export const createCheckInSlice: SliceStateCreator<CheckInSlice> = (set) => ({
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
});
