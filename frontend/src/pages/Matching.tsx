import { useState } from 'react';
import { Card, Row, Col, Table, Tag, Progress, Button, Select, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

const mockMatches = [
  { id: 1, name: '市政府大楼', score: 92, status: '匹配', factors: { qualification: 95, case: 90, team: 88, location: 95 } },
  { id: 2, name: '商业综合体', score: 87, status: '匹配', factors: { qualification: 85, case: 92, team: 85, location: 80 } },
  { id: 3, name: '产业园一期', score: 75, status: '一般', factors: { qualification: 70, case: 80, team: 75, location: 75 } },
  { id: 4, name: '住宅小区', score: 65, status: '不匹配', factors: { qualification: 60, case: 70, team: 65, location: 70 } },
];

const mockFactors = [
  { key: 'qualification', name: '资质匹配度', weight: 30 },
  { key: 'case', name: '业绩匹配度', weight: 30 },
  { key: 'team', name: '团队匹配度', weight: 20 },
  { key: 'location', name: '地域匹配度', weight: 20 },
];

export default function Matching() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <a onClick={() => setSelectedProject(record.id)} style={{ fontWeight: 500 }}>
          {text}
        </a>
      ),
    },
    {
      title: '匹配度',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => (
        <Progress percent={score} size="small" strokeColor={score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444'} />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag
          color={
            status === '匹配' ? 'green' : status === '一般' ? 'orange' : 'red'
          }
          icon={status === '匹配' ? <CheckCircleOutlined /> : status === '一般' ? <InfoCircleOutlined /> : <CloseCircleOutlined />}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button size="small">查看详情</Button>
          <Button size="small" type="primary">开始投标</Button>
        </Space>
      ),
    },
  ];

  const selected = mockMatches.find(m => m.id === selectedProject);

  return (
    <div>
      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <Card title="智能匹配结果">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <span>筛选:</span>
                <Select defaultValue="all" style={{ width: 120 }}>
                  <Option value="all">全部</Option>
                  <Option value="match">匹配</Option>
                  <Option value="normal">一般</Option>
                  <Option value="nomatch">不匹配</Option>
                </Select>
              </Space>
            </div>
            <Table
              columns={columns}
              dataSource={mockMatches}
              rowKey="id"
              pagination={false}
              rowClassName={() => 'cursor-pointer'}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="匹配因素分析">
            {selected ? (
              <div>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <div style={{ fontSize: 14, color: '#64748B' }}>{selected.name}</div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#334155' }}>
                    {selected.score}%
                  </div>
                  <Tag color={selected.status === '匹配' ? 'green' : 'orange'}>
                    {selected.status}
                  </Tag>
                </div>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {mockFactors.map(factor => (
                    <div key={factor.key}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 13 }}>{factor.name}</span>
                        <span style={{ fontSize: 13, color: '#64748B' }}>
                          {selected.factors[factor.key as keyof typeof selected.factors]}%
                        </span>
                      </div>
                      <Progress
                        percent={selected.factors[factor.key as keyof typeof selected.factors]}
                        size="small"
                        showInfo={false}
                        strokeColor="#F97316"
                      />
                    </div>
                  ))}
                </Space>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 48, color: '#94A3B8' }}>
                点击左侧项目查看匹配详情
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
