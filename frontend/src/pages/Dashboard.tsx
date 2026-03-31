import { Card, Row, Col, Statistic, List, Tag, Progress } from 'antd';
import {
  ProjectOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ArrowUpOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const todoItems = [
  { id: 1, title: '市政府大楼项目 - 待提交投标文件', deadline: '2026-04-01', urgent: true },
  { id: 2, title: '商业综合体项目 - 待审批', deadline: '2026-04-03', urgent: false },
  { id: 3, title: '产业园项目 - 补充资质材料', deadline: '2026-04-05', urgent: false },
];

const recommendedProjects = [
  { id: 1, name: '市政府大楼', matchScore: 92, budget: 5000 },
  { id: 2, name: '商业综合体', matchScore: 87, budget: 8000 },
  { id: 3, name: '产业园一期', matchScore: 85, budget: 3000 },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ cursor: 'default' }}>
            <Statistic
              title="招标项目"
              value={23}
              prefix={<ProjectOutlined style={{ color: '#64748B' }} />}
              valueStyle={{ color: '#334155' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ cursor: 'default' }}>
            <Statistic
              title="投标中"
              value={8}
              prefix={<FileTextOutlined style={{ color: '#F97316' }} />}
              valueStyle={{ color: '#334155' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ cursor: 'default' }}>
            <Statistic
              title="待审批"
              value={3}
              prefix={<WarningOutlined style={{ color: '#F59E0B' }} />}
              valueStyle={{ color: '#334155' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ cursor: 'default' }}>
            <Statistic
              title="已中标"
              value={12}
              prefix={<CheckCircleOutlined style={{ color: '#10B981' }} />}
              valueStyle={{ color: '#334155' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card
            title="📋 待办事项"
            extra={<a onClick={() => navigate('/approvals')}>查看全部</a>}
          >
            <List
              dataSource={todoItems}
              renderItem={(item) => (
                <List.Item>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <div>
                      {item.urgent && <Tag color="orange" style={{ marginRight: 8 }}>紧急</Tag>}
                      <span>{item.title}</span>
                    </div>
                    <span style={{ color: '#94A3B8', fontSize: 13 }}>截止: {item.deadline}</span>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="🏢 智能推荐项目"
            extra={<a onClick={() => navigate('/matching')}>查看全部</a>}
          >
            <List
              dataSource={recommendedProjects}
              renderItem={(item) => (
                <List.Item
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/projects/${item.id}`)}
                >
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontWeight: 500 }}>{item.name}</span>
                      <span style={{ color: '#64748B' }}>预算: {item.budget}万</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Progress
                        percent={item.matchScore}
                        size="small"
                        strokeColor="#F97316"
                        trailColor="#E2E8F0"
                      />
                      <ArrowRightOutlined style={{ color: '#94A3B8' }} />
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={8}>
          <Card title="📊 中标率趋势">
            <Statistic
              value={23.5}
              suffix="%"
              prefix={<ArrowUpOutlined style={{ color: '#10B981' }} />}
              valueStyle={{ fontSize: 32, color: '#334155' }}
            />
            <p style={{ color: '#94A3B8', marginTop: 8 }}>较上月 +2.3%</p>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="📈 本月投标统计">
            <Statistic
              value={15}
              valueStyle={{ fontSize: 32, color: '#334155' }}
            />
            <p style={{ color: '#94A3B8', marginTop: 8 }}>投标中: 8个</p>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="⚠️ 风险预警">
            <Statistic
              value={2}
              valueStyle={{ fontSize: 32, color: '#F59E0B' }}
            />
            <p style={{ color: '#94A3B8', marginTop: 8 }}>高风险项目</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
