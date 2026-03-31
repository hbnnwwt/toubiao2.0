import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Input, Select, Upload, message } from 'antd';
import { UploadOutlined, DownloadOutlined, EyeOutlined, DeleteOutlined, SearchOutlined, FolderOutlined } from '@ant-design/icons';

const { Option } = Select;

const mockDocuments = [
  { id: 1, name: '招标文件_市政府大楼.pdf', type: '招标文件', size: '2.5MB', uploadDate: '2026-03-15', uploader: '张三', status: '已完成' },
  { id: 2, name: '技术方案_商业综合体.docx', type: '技术方案', size: '1.8MB', uploadDate: '2026-03-20', uploader: '李四', status: '处理中' },
  { id: 3, name: '资质证书扫描件.pdf', type: '资质文件', size: '3.2MB', uploadDate: '2026-03-18', uploader: '王五', status: '已完成' },
  { id: 4, name: '报价单_产业园.xlsx', type: '商务文件', size: '0.5MB', uploadDate: '2026-03-22', uploader: '张三', status: '已完成' },
  { id: 5, name: '业绩证明材料.pdf', type: '业绩材料', size: '5.1MB', uploadDate: '2026-03-10', uploader: '李四', status: '已完成' },
];

const typeColors: Record<string, string> = {
  '招标文件': 'blue',
  '技术方案': 'purple',
  '资质文件': 'green',
  '商务文件': 'orange',
  '业绩材料': 'cyan',
};

export default function Documents() {
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

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
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color={typeColors[type]}>{type}</Tag>,
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '上传时间',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
    },
    {
      title: '上传人',
      dataIndex: 'uploader',
      key: 'uploader',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === '已完成' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button size="small" icon={<EyeOutlined />}>预览</Button>
          <Button size="small" icon={<DownloadOutlined />}>下载</Button>
          <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      ),
    },
  ];

  const filteredData = mockDocuments.filter(doc => {
    const matchSearch = !searchText || doc.name.includes(searchText);
    const matchType = typeFilter === 'all' || doc.type === typeFilter;
    return matchSearch && matchType;
  });

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
            >
              <Option value="all">全部类型</Option>
              <Option value="招标文件">招标文件</Option>
              <Option value="技术方案">技术方案</Option>
              <Option value="资质文件">资质文件</Option>
              <Option value="商务文件">商务文件</Option>
              <Option value="业绩材料">业绩材料</Option>
            </Select>
          </Space>
          <Upload>
            <Button type="primary" icon={<UploadOutlined />} onClick={() => message.info('点击选择文件上传')}>
              上传文档
            </Button>
          </Upload>
        </div>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
