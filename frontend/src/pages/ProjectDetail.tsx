import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Tag, Descriptions, Progress, Divider, Space } from 'antd';
import {
  ArrowLeftOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
} from '@ant-design/icons';

const mockProject = {
  id: 1,
  name: '市政府大楼基础设施项目',
  type: '基础设施',
  budget: 5000,
  period: '24个月',
  bidMethod: '公开招标',
  qualifications: '特级/一级资质',
  bidder: '北京市住建委',
  publishDate: '2026-03-15',
  riskLevel: 65,
  risks: {
    tech: { level: 'low', score: 80 },
    finance: { level: 'medium', score: 60 },
    legal: { level: 'low', score: 85 },
    management: { level: 'medium', score: 55 },
  },
  files: [
    { name: '招标文件_2026.pdf', size: '2.5MB' },
    { name: '技术规格书.docx', size: '1.2MB' },
  ],
};

export default function ProjectDetail() {
  const { id: _id } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/projects')}>
          返回
        </Button>
        <Space>
          <Button icon={<ShareAltOutlined />}>分享</Button>
          <Button type="primary" icon={<EditOutlined />}>开始投标</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="项目概况">
            <Descriptions column={2}>
              <Descriptions.Item label="项目类型">{mockProject.type}</Descriptions.Item>
              <Descriptions.Item label="预算金额">{mockProject.budget}万</Descriptions.Item>
              <Descriptions.Item label="建设周期">{mockProject.period}</Descriptions.Item>
              <Descriptions.Item label="招标方式">{mockProject.bidMethod}</Descriptions.Item>
              <Descriptions.Item label="资质要求">{mockProject.qualifications}</Descriptions.Item>
              <Descriptions.Item label="招标单位">{mockProject.bidder}</Descriptions.Item>
              <Descriptions.Item label="发布时间">{mockProject.publishDate}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="📄 招标文件" style={{ marginTop: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {mockProject.files.map((file, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#F8FAFC', borderRadius: 8 }}>
                  <div>
                    <span style={{ fontWeight: 500 }}>{file.name}</span>
                    <span style={{ color: '#94A3B8', marginLeft: 8 }}>({file.size})</span>
                  </div>
                  <Space>
                    <Button size="small" icon={<EyeOutlined />}>预览</Button>
                    <Button size="small" icon={<DownloadOutlined />}>下载</Button>
                  </Space>
                </div>
              ))}
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card title="🛡️ 风险评估">
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 14, color: '#64748B', marginBottom: 8 }}>综合风险评分</div>
              <Progress
                type="circle"
                percent={mockProject.riskLevel}
                size={120}
                strokeColor={
                  mockProject.riskLevel >= 70 ? '#10B981' :
                  mockProject.riskLevel >= 40 ? '#F59E0B' : '#EF4444'
                }
              />
              <div style={{ marginTop: 8, fontWeight: 500, color: '#334155' }}>
                {mockProject.riskLevel >= 70 ? '低风险' : mockProject.riskLevel >= 40 ? '中等风险' : '高风险'}
              </div>
            </div>
            <Divider />
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>技术风险</span>
                <Tag color={mockProject.risks.tech.level === 'low' ? 'green' : 'orange'}>
                  {mockProject.risks.tech.level === 'low' ? '低' : '中'}
                </Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>财务风险</span>
                <Tag color={mockProject.risks.finance.level === 'low' ? 'green' : 'orange'}>
                  {mockProject.risks.finance.level === 'low' ? '低' : '中'}
                </Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>法律风险</span>
                <Tag color={mockProject.risks.legal.level === 'low' ? 'green' : 'orange'}>
                  {mockProject.risks.legal.level === 'low' ? '低' : '中'}
                </Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>管理风险</span>
                <Tag color={mockProject.risks.management.level === 'low' ? 'green' : 'orange'}>
                  {mockProject.risks.management.level === 'low' ? '低' : '中'}
                </Tag>
              </div>
            </Space>
            <Button type="link" style={{ padding: 0, marginTop: 16 }}>查看详细风险报告 →</Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
