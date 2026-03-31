import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Tabs, Form, Input, InputNumber, Button, Space, List, Tag } from 'antd';
import { SaveOutlined, SendOutlined, BulbOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const mockRecommendedPrice = { min: 4800, max: 5200 };

const mockCases = [
  { name: '市政府大楼一期', year: 2024, result: '中标' },
  { name: '政务中心', year: 2023, result: '中标' },
  { name: '某区政府大楼', year: 2022, result: '未中' },
];

export default function Bidding() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('business');

  const projectName = projectId ? '市政府大楼项目' : '选择项目开始投标';

  return (
    <div>
      <Card
        title={`投标文件编制 - ${projectName}`}
        extra={
          <Space>
            <Button icon={<SaveOutlined />}>保存</Button>
            <Button type="primary" icon={<SendOutlined />}>提交</Button>
          </Space>
        }
      >
        {!projectId ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#94A3B8' }}>
            请从项目列表选择要投标的项目
            <Button type="link" onClick={() => navigate('/projects')}>去选择 →</Button>
          </div>
        ) : (
          <>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                { key: 'business', label: '商务标' },
                { key: 'technical', label: '技术标' },
                { key: 'qualifications', label: '资质文件' },
                { key: 'cases', label: '业绩材料' },
              ]}
            />
            <Row gutter={24}>
              <Col xs={24} lg={14}>
                <Card title="商务标填写" size="small">
                  <Form layout="vertical">
                    <Form.Item label="投标总价">
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="请输入投标总价"
                        addonAfter="万"
                      />
                    </Form.Item>
                    <Form.Item label="工期报价">
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="请输入工期"
                        addonAfter="天"
                      />
                    </Form.Item>
                    <Form.Item label="付款方式">
                      <TextArea rows={3} placeholder="请输入付款方式" />
                    </Form.Item>
                    <Form.Item label="报价构成明细">
                      <TextArea rows={6} placeholder="请输入报价构成明细" />
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
              <Col xs={24} lg={10}>
                <Card
                  title="🤖 智能推荐"
                  style={{ marginBottom: 16 }}
                  headStyle={{ background: '#FFF7ED' }}
                >
                  <div style={{ marginBottom: 12 }}>
                    <BulbOutlined style={{ color: '#F97316', marginRight: 8 }} />
                    基于类似项目，推荐报价区间
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 600, color: '#334155' }}>
                    {mockRecommendedPrice.min} - {mockRecommendedPrice.max} 万
                  </div>
                  <Button type="link" size="small" style={{ padding: 0 }}>
                    查看推荐依据 →
                  </Button>
                </Card>

                <Card title="📋 相关业绩案例" size="small">
                  <List
                    size="small"
                    dataSource={mockCases}
                    renderItem={(item) => (
                      <List.Item>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ fontWeight: 500 }}>{item.name}</div>
                            <div style={{ fontSize: 12, color: '#94A3B8' }}>{item.year}年</div>
                          </div>
                          <Tag color={item.result === '中标' ? 'green' : 'red'}>
                            {item.result}
                          </Tag>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Card>
    </div>
  );
}
