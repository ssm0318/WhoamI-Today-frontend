import { MyCheckIn } from '@models/checkIn';
import { getCheckInList } from '@utils/apis/checkIn';
import { SliceStateCreator } from './useBoundStore';

interface CheckInState {
  checkIn: MyCheckIn | null;
}
interface CheckInAction {
  fetchCheckIn: () => Promise<MyCheckIn | null>;
}

const initialState = {
  checkIn: null,
};

export type CheckInSlice = CheckInState & CheckInAction;

export const createCheckInSlice: SliceStateCreator<CheckInSlice> = (set) => ({
  ...initialState,
  fetchCheckIn: async () => {
    const { results: checkInList } = await getCheckInList();
    if (!checkInList) return null;
    const currentCheckIn = checkInList[0];
    set(() => ({
      checkIn: currentCheckIn,
    }));
    return currentCheckIn;
  },
});
