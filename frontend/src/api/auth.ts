import client from './client';

interface LoginParams {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    username: string;
    email: string;
    full_name?: string;
    company?: string;
  };
}

export const authApi = {
  // 登录
  login: async (params: LoginParams): Promise<LoginResponse> => {
    const formData = new URLSearchParams();
    formData.append('username', params.username);
    formData.append('password', params.password);

    const response = await client.post('/users/login/', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  // 获取当前用户
  getCurrentUser: async () => {
    const response = await client.get('/users/me/');
    return response.data;
  },

  // 登出 (清除本地token)
  logout: async () => {
    // 后端无需专门登出接口，只需清除本地token
    return true;
  },
};

export default authApi;