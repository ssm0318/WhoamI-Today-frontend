import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import i18n from '@i18n/index';

export const API_BASE_URL = 'http://192.168.0.105:8000/api/';

const JSON_DEFAULT_OPTIONS: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  withCredentials: true,
  xsrfHeaderName: 'X-CSRFTOKEN',
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
