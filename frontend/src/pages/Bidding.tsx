import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Row, Col, Tabs, Form, Input, InputNumber, Button, Space, Tag, message, Spin } from 'antd';
import { SaveOutlined, SendOutlined, BulbOutlined } from '@ant-design/icons';
import { biddingApi, projectsApi } from '../api';

const { TextArea } = Input;

export default function Bidding() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('business');
  const [form] = Form.useForm();

  const selectedProjectId = projectId ? Number(projectId) : null;

  // 获取项目详情
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', selectedProjectId],
    queryFn: () => projectsApi.getDetail(selectedProjectId!),
    enabled: !!selectedProjectId,
  });

  // 获取我的投标列表
  const { data: myBids } = useQuery({
    queryKey: ['my-bids'],
    queryFn: () => biddingApi.getMyBids(),
  });

  // 获取当前项目的投标
  const currentBid = myBids?.results.find(b => b.project === selectedProjectId);

  // 创建投标Mutation
  const createMutation = useMutation({
    mutationFn: (data: { project: number }) => biddingApi.createSubmission(data),
    onSuccess: () => {
      message.success('投标创建成功');
      queryClient.invalidateQueries({ queryKey: ['my-bids'] });
    },
    onError: () => {
      message.error('创建失败');
    },
  });

  // 保存投标Mutation
  const saveMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: unknown }) => biddingApi.updateSubmission(id, data as Parameters<typeof biddingApi.updateSubmission>[1]),
    onSuccess: () => {
      message.success('保存成功');
      queryClient.invalidateQueries({ queryKey: ['my-bids'] });
    },
    onError: () => {
      message.error('保存失败');
    },
  });

  // 提交投标Mutation
  const submitMutation = useMutation({
    mutationFn: (id: number) => biddingApi.submitBid(id),
    onSuccess: () => {
      message.success('提交成功');
      queryClient.invalidateQueries({ queryKey: ['my-bids'] });
    },
    onError: () => {
      message.error('提交失败');
    },
  });

  // 模拟推荐价格 (后端暂无)
  const mockRecommendedPrice = project?.budget
    ? { min: Math.round(project.budget * 0.96), max: Math.round(project.budget * 1.04) }
    : { min: 4800, max: 5200 };

  const projectName = project?.name || (projectId ? '加载中...' : '选择项目开始投标');

  const handleSave = () => {
    if (!selectedProjectId) return;

    form.validateFields().then(values => {
      if (currentBid) {
        saveMutation.mutate({ id: currentBid.id, data: values });
      } else {
        createMutation.mutate({ project: selectedProjectId, ...values });
      }
    });
  };

  const handleSubmit = () => {
    if (!currentBid) {
      message.warning('请先保存投标文件');
      return;
    }
    submitMutation.mutate(currentBid.id);
  };

  if (projectLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Card
        title={`投标文件编制 - ${projectName}`}
        extra={
          <Space>
            <Button
              icon={<SaveOutlined />}
              onClick={handleSave}
              loading={createMutation.isPending || saveMutation.isPending}
            >
              保存
            </Button>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSubmit}
              loading={submitMutation.isPending}
              disabled={!currentBid}
            >
              提交
            </Button>
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
              ]}
            />
            <Row gutter={24}>
              <Col xs={24} lg={14}>
                <Card title="投标文件填写" size="small">
                  <Form
                    form={form}
                    layout="vertical"
                    initialValues={currentBid || {}}
                  >
                    <Form.Item label="投标总价" name="total_price">
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="请输入投标总价"
                        addonAfter="万"
                      />
                    </Form.Item>
                    <Form.Item label="工期报价" name="period">
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="请输入工期"
                        addonAfter="天"
                      />
                    </Form.Item>
                    <Form.Item label="付款方式" name="payment_method">
                      <TextArea rows={3} placeholder="请输入付款方式" />
                    </Form.Item>
                    <Form.Item label="报价构成明细" name="price_breakdown">
                      <TextArea rows={6} placeholder="请输入报价构成明细" />
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
              <Col xs={24} lg={10}>
                <Card
                  title="智能推荐"
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

                <Card title="投标状态" size="small">
                  {currentBid ? (
                    <Tag color={
                      currentBid.status === 'draft' ? 'orange' :
                      currentBid.status === 'pending' ? 'purple' :
                      currentBid.status === 'approved' ? 'green' : 'red'
                    }>
                      {currentBid.status === 'draft' ? '草稿' :
                        currentBid.status === 'pending' ? '待审批' :
                        currentBid.status === 'approved' ? '已通过' :
                        currentBid.status === 'rejected' ? '已驳回' : currentBid.status}
                    </Tag>
                  ) : (
                    <Tag>未创建</Tag>
                  )}
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Card>
    </div>
  );
}