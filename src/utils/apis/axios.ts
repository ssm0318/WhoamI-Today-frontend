import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import i18n from '@i18n/index';

const JSON_DEFAULT_OPTIONS: AxiosRequestConfig = {
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true,
  xsrfHeaderName: 'X-CSRFTOKEN',
  xsrfCookieName: 'csrftoken',
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': i18n.language,
  },
};

const axiosJsonInstance: AxiosInstance = axios.create(JSON_DEFAULT_OPTIONS);

export default axiosJsonInstance;
