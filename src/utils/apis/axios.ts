import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import i18n from '@i18n/index';

// NOTE: PROD_BASE_URL은 실제 배포된 도메인 주소
export const PROD_BASE_URL = 'https://whoami-test-group.gina-park.site';

export const PROD_API_URL = `${PROD_BASE_URL}/api/`;
export const DEV_API_URL = 'http://localhost:8000/api/';

export const API_BASE_URL = process.env.NODE_ENV === 'production' ? PROD_API_URL : DEV_API_URL;

const JSON_DEFAULT_OPTIONS: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  xsrfHeaderName: 'X-CSRFToken',
  xsrfCookieName: 'csrftoken',
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': i18n.language,
  },
};

const axiosJsonInstance: AxiosInstance = axios.create(JSON_DEFAULT_OPTIONS);

export const axiosFormDataInstance: AxiosInstance = axios.create({
  ...JSON_DEFAULT_OPTIONS,
  headers: {
    ...JSON_DEFAULT_OPTIONS.headers,
    'Content-Type': 'multipart/form-data',
  },
});

// 서버 다운(502/503) 시 maintenance 페이지로 이동
const maintenanceInterceptor = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 502 || status === 503 || !error.response) {
      window.location.replace('/maintenance.html');
      return new Promise(() => {}); // 이후 체인 중단
    }
  }
  return Promise.reject(error);
};

axiosJsonInstance.interceptors.response.use(undefined, maintenanceInterceptor);
axiosFormDataInstance.interceptors.response.use(undefined, maintenanceInterceptor);

export default axiosJsonInstance;
