import client from './client';

export interface Project {
  id: number;
  name: string;
  code?: string;
  category: number;
  category_name?: string;
  region?: string;
  budget?: number;
  period?: string;
  bid_method?: string;
  qualifications?: string;
  bidder?: string;
  publish_date?: string;
  deadline?: string;
  status: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectListParams {
  status?: string;
  category?: number;
  search?: string;
  page?: number;
  page_size?: number;
}

interface ProjectListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Project[];
}

export const projectsApi = {
  // 获取项目列表
  getList: async (params?: ProjectListParams): Promise<ProjectListResponse> => {
    const response = await client.get('/projects/', { params });
    return response.data;
  },

  // 获取项目详情
  getDetail: async (id: number): Promise<Project> => {
    const response = await client.get(`/projects/${id}/`);
    return response.data;
  },

  // 获取招标中项目
  getBidding: async (params?: ProjectListParams): Promise<ProjectListResponse> => {
    const response = await client.get('/projects/bidding/', { params });
    return response.data;
  },

  // 获取项目分类
  getCategories: async () => {
    const response = await client.get('/projects/categories/');
    return response.data;
  },
};

export default projectsApi;