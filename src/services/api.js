import axios from 'axios';

const Error = {
  UNAUTHORIZED: 401
}

const BASE_URL = `https://api.antushev.com`;
const TIMEOUT = 30000;
const WITH_CREDENTIALS = false;

export const createApi = (onUnauthorized) => {
  const api = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
    withCredentials: WITH_CREDENTIALS
  });

  const onSuccess = (response) => {
    return response;
  }

  const onFail = (error) => {
    const { response } = error;

    if (response.status === Error.UNAUTHORIZED) {
      onUnauthorized();

      throw error;
    }
  }

  api.interceptors.response.use(onSuccess, onFail);

  return api;
}
