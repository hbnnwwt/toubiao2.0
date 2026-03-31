import { useState } from 'react';
import { Table, Tag, Button, Input, Select, Space, Card } from 'antd';
import { EyeOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

interface Project {
  id: number;
  name: string;
  type: string;
  budget: number;
  region: string;
  deadline: string;
  status: string;
}

const mockData: Project[] = [
  { id: 1, name: '市政府大楼', type: '基础设施', budget: 5000, region: '北京', deadline: '2026-04-15', status: '招标中' },
  { id: 2, name: '商业综合体', type: '商业', budget: 8000, region: '上海', deadline: '2026-04-20', status: '投标中' },
  { id: 3, name: '产业园一期', type: '工业', budget: 3000, region: '深圳', deadline: '2026-04-10', status: '已结束' },
  { id: 4, name: '住宅小区', type: '住宅', budget: 2000, region: '成都', deadline: '2026-04-25', status: '招标中' },
  { id: 5, name: '医院扩建', type: '医疗', budget: 4500, region: '广州', deadline: '2026-04-18', status: '评标中' },
  { id: 6, name: '学校新建', type: '教育', budget: 2800, region: '杭州', deadline: '2026-04-22', status: '招标中' },
];

const statusColors: Record<string, string> = {
  '招标中': 'blue',
  '投标中': 'orange',
  '评标中': 'purple',
  '已结束': 'default',
};

export default function ProjectList() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState('');

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <a style={{ fontWeight: 500 }}>{text}</a>,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '预算(万)',
      dataIndex: 'budget',
      key: 'budget',
      render: (val: number) => `¥${val.toLocaleString()}`,
    },
    {
      title: '地区',
      dataIndex: 'region',
      key: 'region',
    },
    {
      title: '截止日期',
      dataIndex: 'deadline',
      key: 'deadline',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Project) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/projects/${record.id}`)}
          >
            查看
          </Button>
          {record.status === '招标中' && (
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

  const filteredData = mockData.filter(item => {
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchType = typeFilter === 'all' || item.type === typeFilter;
    const matchSearch = !searchText || item.name.includes(searchText);
    return matchStatus && matchType && matchSearch;
  });

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
          >
            <Option value="all">全部状态</Option>
            <Option value="招标中">招标中</Option>
            <Option value="投标中">投标中</Option>
            <Option value="评标中">评标中</Option>
            <Option value="已结束">已结束</Option>
          </Select>
          <Select
            value={typeFilter}
            onChange={setTypeFilter}
            style={{ width: 120 }}
          >
            <Option value="all">全部类型</Option>
            <Option value="基础设施">基础设施</Option>
            <Option value="商业">商业</Option>
            <Option value="工业">工业</Option>
            <Option value="住宅">住宅</Option>
            <Option value="医疗">医疗</Option>
            <Option value="教育">教育</Option>
          </Select>
        </Space>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
        />
      </Card>
    </div>
  );
}
