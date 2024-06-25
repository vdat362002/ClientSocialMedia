import axios, { AxiosRequestConfig } from "axios";

import store from "../redux/store/store";
import { logoutStart } from "../redux/action/authActions";

export const SocialMediaUrl =
  process.env.REACT_APP_SocialMedia_URL || "https://localhost:4000";
const SocialMediaApiVersion =
  process.env.REACT_APP_SocialMedia_API_VERSION || "v1";

export const api = `${SocialMediaUrl}/api/${SocialMediaApiVersion}`;

axios.defaults.baseURL = api;
axios.defaults.withCredentials = true;

let isLogoutTriggered = false;

function resetIsLogoutTriggered() {
  isLogoutTriggered = false;
}

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const { data, status } = error.response;
    if (
      status === 401 &&
      (data?.error?.type || "") !== "INCORRECT_CREDENTIALS" &&
      error.config &&
      !error.config.__isRetryRequest
    ) {
      if (!isLogoutTriggered) {
        isLogoutTriggered = true;
        store.dispatch(logoutStart(resetIsLogoutTriggered));
      }
    }
    return Promise.reject(error);
  }
);

const httpRequest = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const request = await axios(req);

      resolve(request.data.data);
    } catch (e) {
      reject(e?.response?.data || {});
    }
  });
};

export default httpRequest;
