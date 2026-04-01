import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Tag, Button, Input, Select, Space, Card } from 'antd';
import { EyeOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { projectsApi } from '../api';

const { Option } = Select;

const statusColors: Record<string, string> = {
  'bidding': 'blue',
  'draft': 'orange',
  'pending': 'purple',
  'approved': 'green',
  'rejected': 'red',
  'closed': 'default',
};

const statusLabels: Record<string, string> = {
  'bidding': '招标中',
  'draft': '草稿',
  'pending': '待审批',
  'approved': '已通过',
  'rejected': '已驳回',
  'closed': '已结束',
};

export default function ProjectList() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState('');

  // 获取项目列表
  const { data, isLoading } = useQuery({
    queryKey: ['projects', statusFilter, searchText],
    queryFn: () => projectsApi.getList({
      status: statusFilter === 'all' ? undefined : statusFilter,
      search: searchText || undefined,
      page_size: 100,
    }),
  });

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <a style={{ fontWeight: 500 }}>{text}</a>,
    },
    {
      title: '类型',
      dataIndex: 'category_name',
      key: 'category_name',
    },
    {
      title: '预算(万)',
      dataIndex: 'budget',
      key: 'budget',
      render: (val: number) => val ? `¥${val.toLocaleString()}` : '-',
    },
    {
      title: '地区',
      dataIndex: 'region',
      key: 'region',
      render: (val: string) => val || '-',
    },
    {
      title: '截止日期',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (val: string) => val || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColors[status] || 'default'}>
          {statusLabels[status] || status}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: { id: number; status: string }) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/projects/${record.id}`)}
          >
            查看
          </Button>
          {record.status === 'bidding' && (
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => navigate(`/bidding/${record.id}`)}
            >
              投标
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: '100%' }}>
          <Input
            placeholder="搜索项目..."
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 120 }}
            loading={isLoading}
          >
            <Option value="all">全部状态</Option>
            <Option value="bidding">招标中</Option>
            <Option value="pending">投标中</Option>
            <Option value="approved">已通过</Option>
            <Option value="closed">已结束</Option>
          </Select>
        </Space>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={data?.results || []}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
        />
      </Card>
    </div>
  );
}