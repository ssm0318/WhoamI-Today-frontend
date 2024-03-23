import { SliceStateCreator } from './useBoundStore';

interface ToastState {
  message?: string;
}

interface ToastAction {
  openToast: (msg: string) => void;
  closeToast: () => void;
}

const initialState = {
  message: undefined,
};

export type ToastSlice = ToastState & ToastAction;

export const createToastSlice: SliceStateCreator<ToastSlice> = (set) => ({
  ...initialState,
  openToast: (msg: string) => set(() => ({ message: msg }), false, 'toast/openToast'),
  closeToast: () => set(() => ({ message: undefined }), false, 'toast/closeToast'),
});
