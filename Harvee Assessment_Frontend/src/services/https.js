/**
 * src/api/http.js
 */
import axios from "axios";
import qs from "qs";
import Constants from "@constants/index";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 *
 * parse error response
 */
function parseError(messages) {
  // error
  if (messages) {
    if (messages instanceof Array) {
      return Promise.reject({ messages: messages });
    } else {
      return Promise.reject({ messages: [messages] });
    }
  } else {
    return Promise.reject({ messages: ["Something went wrong!"] });
  }
}

/**
 * parse response
 */
function parseBody(response) {
  // Check if the status code is 200.
  if (response.status === 200) {
    return response.data; // If so, return the response data.
  } else if (response.status >= 500) {
    // if the status is 5xx do not show message from backend that may cause html content, provide your own message
    return parseError("Internal Server Error");
  } else {
    // If the status code is not 200, call `parseError()` with the response's error messages.
    return parseError(response.data.messages);
  }
}

/**
 * axios instance
 */
let https = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  paramsSerializer: function (params) {
    return qs.stringify(params, { indices: false });
  },
});

// request header
https.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(Constants.AUTH.ACCESS_TOKEN) || "";
    config.headers = { Authorization: `Bearer ${token}` };
    return config;
  },
  (error) => Promise.reject(error)
);

// response parse
https.interceptors.response.use(
  (response) => parseBody(response),
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem(Constants.AUTH.REFRESH_TOKEN);

      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/auth/signin";
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/auth/refresh-token`,
          { refreshToken }
        );

        const newAccessToken = response.data.data.accessToken;
        localStorage.setItem(Constants.AUTH.ACCESS_TOKEN, newAccessToken);

        https.defaults.headers.common["Authorization"] =
          "Bearer " + newAccessToken;
        originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;

        processQueue(null, newAccessToken);
        isRefreshing = false;

        return https(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        localStorage.clear();
        window.location.href = "/auth/signin";
        return Promise.reject(refreshError);
      }
    }

    if (error?.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/auth/signin";
    }

    if (error.response) return parseError(error.response.data);
    return Promise.reject(error);
  }
);

export default https;
