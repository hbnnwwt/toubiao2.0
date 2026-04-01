import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, Row, Col, Button, Tag, Descriptions, Progress, Divider, Space, Spin } from 'antd';
import {
  ArrowLeftOutlined,
  ShareAltOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { projectsApi } from '../api';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const projectId = Number(id);

  // 获取项目详情
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.getDetail(projectId),
    enabled: !!projectId,
  });

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        项目不存在
      </div>
    );
  }

  // 模拟风险数据 (后端暂无)
  const riskLevel = 65;
  const risks = {
    tech: { level: 'low', score: 80 },
    finance: { level: 'medium', score: 60 },
    legal: { level: 'low', score: 85 },
    management: { level: 'medium', score: 55 },
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/projects')}>
          返回
        </Button>
        <Space>
          <Button icon={<ShareAltOutlined />}>分享</Button>
          <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/bidding/${projectId}`)}>开始投标</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="项目概况">
            <Descriptions column={2}>
              <Descriptions.Item label="项目类型">{project.category_name || '-'}</Descriptions.Item>
              <Descriptions.Item label="预算金额">{project.budget ? `${project.budget}万` : '-'}</Descriptions.Item>
              <Descriptions.Item label="建设周期">{project.period || '-'}</Descriptions.Item>
              <Descriptions.Item label="招标方式">{project.bid_method || '-'}</Descriptions.Item>
              <Descriptions.Item label="资质要求">{project.qualifications || '-'}</Descriptions.Item>
              <Descriptions.Item label="招标单位">{project.bidder || '-'}</Descriptions.Item>
              <Descriptions.Item label="发布时间">{project.publish_date || '-'}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="项目描述" style={{ marginTop: 16 }}>
            <p>{project.description || '暂无描述'}</p>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card title="风险评估">
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 14, color: '#64748B', marginBottom: 8 }}>综合风险评分</div>
              <Progress
                type="circle"
                percent={riskLevel}
                size={120}
                strokeColor={
                  riskLevel >= 70 ? '#10B981' :
                  riskLevel >= 40 ? '#F59E0B' : '#EF4444'
                }
              />
              <div style={{ marginTop: 8, fontWeight: 500, color: '#334155' }}>
                {riskLevel >= 70 ? '低风险' : riskLevel >= 40 ? '中等风险' : '高风险'}
              </div>
            </div>
            <Divider />
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>技术风险</span>
                <Tag color={risks.tech.level === 'low' ? 'green' : 'orange'}>
                  {risks.tech.level === 'low' ? '低' : '中'}
                </Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>财务风险</span>
                <Tag color={risks.finance.level === 'low' ? 'green' : 'orange'}>
                  {risks.finance.level === 'low' ? '低' : '中'}
                </Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>法律风险</span>
                <Tag color={risks.legal.level === 'low' ? 'green' : 'orange'}>
                  {risks.legal.level === 'low' ? '低' : '中'}
                </Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>管理风险</span>
                <Tag color={risks.management.level === 'low' ? 'green' : 'orange'}>
                  {risks.management.level === 'low' ? '低' : '中'}
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