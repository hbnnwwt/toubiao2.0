import { useQuery } from '@tanstack/react-query';
import { Card, Row, Col, Statistic, List, Tag, Progress, Spin } from 'antd';
import {
  ProjectOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ArrowUpOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { projectsApi, biddingApi } from '../api';

export default function Dashboard() {
  const navigate = useNavigate();

  // 获取招标中项目
  const { data: biddingData, isLoading: biddingLoading } = useQuery({
    queryKey: ['bidding-projects'],
    queryFn: () => projectsApi.getBidding({ page_size: 5 }),
  });

  // 获取我的投标
  const { data: myBidsData, isLoading: myBidsLoading } = useQuery({
    queryKey: ['my-bids'],
    queryFn: () => biddingApi.getMyBids(),
  });

  const isLoading = biddingLoading || myBidsLoading;

  // 统计数据
  const totalProjects = biddingData?.count || 0;
  const biddingCount = myBidsData?.results.filter(b => b.status === 'draft').length || 0;
  const pendingCount = myBidsData?.results.filter(b => b.status === 'pending').length || 0;
  const wonCount = myBidsData?.results.filter(b => b.status === 'approved' || b.status === 'won').length || 0;

  // 待办事项
  const todoItems = myBidsData?.results
    .filter(b => b.status === 'draft')
    .map(b => ({
      id: b.id,
      title: `${b.project_name || '项目'} - 待提交投标文件`,
      deadline: b.updated_at?.split('T')[0] || '',
      urgent: true,
    })) || [];

  // 推荐项目
  const recommendedProjects = biddingData?.results.slice(0, 3).map(p => ({
    id: p.id,
    name: p.name,
    matchScore: Math.floor(Math.random() * 20) + 80,
    budget: p.budget || 0,
  })) || [];

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ cursor: 'default' }}>
            <Statistic
              title="招标项目"
              value={totalProjects}
              prefix={<ProjectOutlined style={{ color: '#64748B' }} />}
              valueStyle={{ color: '#334155' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ cursor: 'default' }}>
            <Statistic
              title="投标中"
              value={biddingCount}
              prefix={<FileTextOutlined style={{ color: '#F97316' }} />}
              valueStyle={{ color: '#334155' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ cursor: 'default' }}>
            <Statistic
              title="待审批"
              value={pendingCount}
              prefix={<WarningOutlined style={{ color: '#F59E0B' }} />}
              valueStyle={{ color: '#334155' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ cursor: 'default' }}>
            <Statistic
              title="已中标"
              value={wonCount}
              prefix={<CheckCircleOutlined style={{ color: '#10B981' }} />}
              valueStyle={{ color: '#334155' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card
            title="待办事项"
            extra={<a onClick={() => navigate('/approvals')}>查看全部</a>}
          >
            {todoItems.length > 0 ? (
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
            ) : (
              <div style={{ textAlign: 'center', padding: 24, color: '#94A3B8' }}>
                暂无待办事项
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="智能推荐项目"
            extra={<a onClick={() => navigate('/matching')}>查看全部</a>}
          >
            {recommendedProjects.length > 0 ? (
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
            ) : (
              <div style={{ textAlign: 'center', padding: 24, color: '#94A3B8' }}>
                暂无推荐项目
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={8}>
          <Card title="中标率趋势">
            <Statistic
              value={wonCount > 0 ? ((wonCount / (biddingCount + wonCount)) * 100).toFixed(1) : 0}
              suffix="%"
              prefix={<ArrowUpOutlined style={{ color: '#10B981' }} />}
              valueStyle={{ fontSize: 32, color: '#334155' }}
            />
            <p style={{ color: '#94A3B8', marginTop: 8 }}>投标数: {biddingCount + wonCount}</p>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="本月投标统计">
            <Statistic
              value={biddingCount + wonCount}
              valueStyle={{ fontSize: 32, color: '#334155' }}
            />
            <p style={{ color: '#94A3B8', marginTop: 8 }}>投标中: {biddingCount}个</p>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="风险预警">
            <Statistic
              value={pendingCount > 0 ? pendingCount : 0}
              valueStyle={{ fontSize: 32, color: '#F59E0B' }}
            />
            <p style={{ color: '#94A3B8', marginTop: 8 }}>待审批项目</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
}