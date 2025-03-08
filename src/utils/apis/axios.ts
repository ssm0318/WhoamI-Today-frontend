import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import i18n from '@i18n/index';

export const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://whoami-test-group.gina-park.site/api/' // TODO: 배포 후 변경
    : 'http://localhost:8000/api/';

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

export default axiosJsonInstance;
