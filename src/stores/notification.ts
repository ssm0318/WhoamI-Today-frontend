import { sliceResetFns } from './resetSlices';
import { SliceStateCreator } from './useBoundStore';

interface NotificationState {
  appNotiPermission: boolean;
}
interface NotificationAction {
  setAppNotiPermission: (permission: boolean) => Promise<void>;
}

const initialState = {
  appNotiPermission: false,
};

export type NotificationSlice = NotificationState & NotificationAction;

export const createNotificationSlice: SliceStateCreator<NotificationSlice> = (set) => {
  sliceResetFns.add(() => set(initialState));
  return {
    ...initialState,
    setAppNotiPermission: async (permission) => {
      set(() => ({
        appNotiPermission: permission,
      }));
    },
  };
};
