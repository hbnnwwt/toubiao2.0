import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Table, Tag, Button, Space, Input, Select, Upload, message, Spin } from 'antd';
import { UploadOutlined, DownloadOutlined, EyeOutlined, DeleteOutlined, SearchOutlined, FolderOutlined } from '@ant-design/icons';
import { documentsApi } from '../api';

const { Option } = Select;

const typeColors: Record<string, string> = {
  'bidding': 'blue',
  'technical': 'purple',
  ' qualification': 'green',
  'business': 'orange',
  'case': 'cyan',
};

const typeLabels: Record<string, string> = {
  'bidding': '招标文件',
  'technical': '技术方案',
  'qualification': '资质文件',
  'business': '商务文件',
  'case': '业绩材料',
};

export default function Documents() {
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const queryClient = useQueryClient();

  // 获取文档列表
  const { data, isLoading } = useQuery({
    queryKey: ['documents', typeFilter, searchText],
    queryFn: () => documentsApi.getList({
      document_type: typeFilter === 'all' ? undefined : typeFilter,
      search: searchText || undefined,
    }),
  });

  // 删除文档Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => documentsApi.delete(id),
    onSuccess: () => {
      message.success('删除成功');
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: () => {
      message.error('删除失败');
    },
  });

  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <FolderOutlined style={{ color: '#64748B' }} />
          <a style={{ fontWeight: 500 }}>{text}</a>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'document_type',
      key: 'document_type',
      render: (type: string) => (
        <Tag color={typeColors[type] || 'default'}>
          {typeLabels[type] || type}
        </Tag>
      ),
    },
    {
      title: '大小',
      dataIndex: 'file_size',
      key: 'file_size',
      render: (size: number) => size ? `${(size / 1024 / 1024).toFixed(2)} MB` : '-',
    },
    {
      title: '上传时间',
      dataIndex: 'uploaded_at',
      key: 'uploaded_at',
      render: (val: string) => val?.split('T')[0] || '-',
    },
    {
      title: '上传人',
      dataIndex: 'uploaded_by_name',
      key: 'uploaded_by_name',
      render: (val: string) => val || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'green' : 'orange'}>
          {status === 'completed' ? '已完成' : '处理中'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: { id: number }) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />}>预览</Button>
          <Button size="small" icon={<DownloadOutlined />}>下载</Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              if (window.confirm('确定要删除该文档吗?')) {
                deleteMutation.mutate(record.id);
              }
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Input
              placeholder="搜索文档..."
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: 120 }}
              loading={isLoading}
            >
              <Option value="all">全部类型</Option>
              <Option value="bidding">招标文件</Option>
              <Option value="technical">技术方案</Option>
              <Option value="qualification">资质文件</Option>
              <Option value="business">商务文件</Option>
              <Option value="case">业绩材料</Option>
            </Select>
          </Space>
          <Upload
            showUploadList={false}
            beforeUpload={() => {
              message.info('上传功能开发中');
              return false;
            }}
          >
            <Button type="primary" icon={<UploadOutlined />}>
              上传文档
            </Button>
          </Upload>
        </div>
        <Table
          columns={columns}
          dataSource={data?.results || []}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}