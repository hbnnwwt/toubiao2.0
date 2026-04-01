import client from './client';

export interface Document {
  id: number;
  name: string;
  file: string;
  file_size?: number;
  document_type: string;
  status: string;
  uploaded_by: number;
  uploaded_by_name?: string;
  uploaded_at: string;
  updated_at?: string;
}

export interface DocumentListParams {
  document_type?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

interface DocumentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Document[];
}

export interface UploadDocumentParams {
  name: string;
  file: File;
  document_type: string;
}

export const documentsApi = {
  // 获取文档列表
  getList: async (params?: DocumentListParams): Promise<DocumentListResponse> => {
    const response = await client.get('/documents/', { params });
    return response.data;
  },

  // 获取文档详情
  getDetail: async (id: number): Promise<Document> => {
    const response = await client.get(`/documents/${id}/`);
    return response.data;
  },

  // 上传文档
  upload: async (data: UploadDocumentParams): Promise<Document> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('file', data.file);
    formData.append('document_type', data.document_type);

    const response = await client.post('/documents/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 删除文档
  delete: async (id: number) => {
    const response = await client.delete(`/documents/${id}/`);
    return response.data;
  },
};

export default documentsApi;