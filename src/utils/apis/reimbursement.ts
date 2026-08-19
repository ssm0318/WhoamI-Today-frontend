import { LocalAllocationPreview, ReimbursementState } from '@models/reimbursement';

import axios from './axios';

export const REIMBURSEMENT_KEY = '/surveys/reimbursement/';
export const LOCAL_ALLOCATION_PREVIEW_KEY = 'local-reimbursement-allocation-preview';
export const LOCAL_REIMBURSEMENT_PREVIEW_URL = 'http://127.0.0.1:4177/api/reimbursement-preview';

export const shouldUseLocalAllocationPreview = (): boolean =>
  process.env.NODE_ENV !== 'production' &&
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);

export const getReimbursementState = async (): Promise<ReimbursementState> => {
  const { data } = await axios.get<ReimbursementState>(REIMBURSEMENT_KEY);
  return data;
};

const getLocalAllocationPreviewViaJsonp = (url: URL): Promise<LocalAllocationPreview | null> =>
  new Promise((resolve) => {
    const callbackName = `__whoamiReimbursementPreview${Date.now()}`;
    url.searchParams.set('callback', callbackName);
    const script = document.createElement('script');
    let settled = false;
    const cleanup = () => {
      delete (window as unknown as Record<string, unknown>)[callbackName];
      script.remove();
    };
    (window as unknown as Record<string, unknown>)[callbackName] = (
      payload: LocalAllocationPreview,
    ) => {
      settled = true;
      cleanup();
      resolve(payload);
    };
    script.onerror = () => {
      if (!settled) {
        cleanup();
        resolve(null);
      }
    };
    script.src = url.toString();
    document.body.appendChild(script);
  });

export const getLocalAllocationPreview = async ([, userId]: readonly [
  string,
  number | null,
]): Promise<LocalAllocationPreview | null> => {
  const url = new URL(LOCAL_REIMBURSEMENT_PREVIEW_URL);
  if (userId !== null) url.searchParams.set('user_id', String(userId));
  return new Promise((resolve) => {
    if (typeof XMLHttpRequest !== 'undefined') {
      const request = new XMLHttpRequest();
      request.open('GET', url.toString());
      request.onload = () => {
        if (request.status < 200 || request.status >= 300) {
          getLocalAllocationPreviewViaJsonp(new URL(url.toString())).then(resolve);
          return;
        }
        resolve(JSON.parse(request.responseText) as LocalAllocationPreview);
      };
      request.onerror = () => {
        getLocalAllocationPreviewViaJsonp(new URL(url.toString())).then(resolve);
      };
      request.send();
      return;
    }

    getLocalAllocationPreviewViaJsonp(url).then(resolve);
  });
};
