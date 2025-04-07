import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:8080',
  // 如需跨域携带凭证（如 Cookies）
  withCredentials: true,
});

http.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('auth_token');
      config.headers = config.headers || {};

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 设置默认 Content-Type，允许被具体请求覆盖
      if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }

      return config;
    },
    (error) => Promise.reject(error)
);

export default http;