import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { useUserStore } from './store/userStore';

// API基础URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// 创建axios实例
const client: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加JWT token
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useUserStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理401错误
client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token过期，清除用户状态并跳转登录
      useUserStore.getState().logout();
      message.error('登录已过期，请重新登录');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;