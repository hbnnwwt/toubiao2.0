import client from './client';

export interface BidSubmission {
  id: number;
  project: number;
  project_name?: string;
  bidder?: number;
  bidder_name?: string;
  status: string;
  total_price?: number;
  period?: number;
  payment_method?: string;
  price_breakdown?: string;
  technical_plan?: string;
  qualifications?: number[];
  cases?: number[];
  members?: number[];
  submitted_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BidListParams {
  project?: number;
  status?: string;
  page?: number;
  page_size?: number;
}

interface BidListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BidSubmission[];
}

export interface CreateBidParams {
  project: number;
  total_price?: number;
  period?: number;
  payment_method?: string;
  price_breakdown?: string;
  technical_plan?: string;
  qualifications?: number[];
  cases?: number[];
  members?: number[];
}

export const biddingApi = {
  // 获取投标列表
  getSubmissions: async (params?: BidListParams): Promise<BidListResponse> => {
    const response = await client.get('/bidding/submissions/', { params });
    return response.data;
  },

  // 获取我的投标
  getMyBids: async (params?: BidListParams): Promise<BidListResponse> => {
    const response = await client.get('/bidding/submissions/my_bids/', { params });
    return response.data;
  },

  // 创建投标
  createSubmission: async (data: CreateBidParams): Promise<BidSubmission> => {
    const response = await client.post('/bidding/submissions/', data);
    return response.data;
  },

  // 更新投标
  updateSubmission: async (id: number, data: Partial<CreateBidParams>): Promise<BidSubmission> => {
    const response = await client.patch(`/bidding/submissions/${id}/`, data);
    return response.data;
  },

  // 提交投标
  submitBid: async (id: number): Promise<BidSubmission> => {
    const response = await client.post(`/bidding/submissions/${id}/submit/`);
    return response.data;
  },

  // 获取资质列表
  getQualifications: async () => {
    const response = await client.get('/bidding/qualifications/');
    return response.data;
  },

  // 获取案例列表
  getCases: async () => {
    const response = await client.get('/bidding/cases/');
    return response.data;
  },

  // 获取人员列表
  getMembers: async () => {
    const response = await client.get('/bidding/members/');
    return response.data;
  },
};

export default biddingApi;