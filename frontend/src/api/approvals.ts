import client from './client';

export interface ApprovalRecord {
  id: number;
  title: string;
  type: string;
  applicant: number;
  applicant_name?: string;
  project?: number;
  project_name?: string;
  content?: string;
  status: string;
  result?: string;
  result_comment?: string;
  approver?: number;
  approver_name?: string;
  applied_at?: string;
  processed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApprovalListParams {
  status?: string;
  type?: string;
  applicant?: number;
  page?: number;
  page_size?: number;
}

interface ApprovalListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApprovalRecord[];
}

export interface ApproveParams {
  comment?: string;
}

export interface RejectParams {
  comment?: string;
}

export const approvalsApi = {
  // 获取审批记录列表
  getRecords: async (params?: ApprovalListParams): Promise<ApprovalListResponse> => {
    const response = await client.get('/approvals/records/', { params });
    return response.data;
  },

  // 获取待审批记录
  getPending: async (params?: ApprovalListParams): Promise<ApprovalListResponse> => {
    const response = await client.get('/approvals/records/pending/', { params });
    return response.data;
  },

  // 获取审批记录详情
  getDetail: async (id: number): Promise<ApprovalRecord> => {
    const response = await client.get(`/approvals/records/${id}/`);
    return response.data;
  },

  // 审批通过
  approve: async (id: number, data?: ApproveParams): Promise<ApprovalRecord> => {
    const response = await client.post(`/approvals/records/${id}/approve/`, data);
    return response.data;
  },

  // 审批驳回
  reject: async (id: number, data?: RejectParams): Promise<ApprovalRecord> => {
    const response = await client.post(`/approvals/records/${id}/reject/`, data);
    return response.data;
  },

  // 创建审批申请
  create: async (data: {
    title: string;
    type: string;
    project?: number;
    content?: string;
  }): Promise<ApprovalRecord> => {
    const response = await client.post('/approvals/records/', data);
    return response.data;
  },
};

export default approvalsApi;