import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Tabs, Table, Tag, Button, Space, Modal, Input, message, Spin } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import { approvalsApi } from '../api';

const { TextArea } = Input;

export default function Approvals() {
  const [activeTab, setActiveTab] = useState('pending');
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();

  // 获取待审批列表
  const { data: pendingData, isLoading: pendingLoading } = useQuery({
    queryKey: ['approvals-pending'],
    queryFn: () => approvalsApi.getPending(),
    enabled: activeTab === 'pending',
  });

  // 获取已审批列表
  const { data: approvedData, isLoading: approvedLoading } = useQuery({
    queryKey: ['approvals-approved'],
    queryFn: () => approvalsApi.getRecords({ status: 'approved' }),
    enabled: activeTab === 'approved',
  });

  const isLoading = activeTab === 'pending' ? pendingLoading : approvedLoading;
  const currentData = activeTab === 'pending' ? pendingData?.results : approvedData?.results;

  // 审批通过Mutation
  const approveMutation = useMutation({
    mutationFn: (id: number) => approvalsApi.approve(id, { comment }),
    onSuccess: () => {
      message.success('审批通过');
      setReviewModalVisible(false);
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['approvals-pending'] });
      queryClient.invalidateQueries({ queryKey: ['approvals-approved'] });
    },
    onError: () => {
      message.error('操作失败');
    },
  });

  // 审批驳回Mutation
  const rejectMutation = useMutation({
    mutationFn: (id: number) => approvalsApi.reject(id, { comment }),
    onSuccess: () => {
      message.success('已驳回');
      setReviewModalVisible(false);
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['approvals-pending'] });
      queryClient.invalidateQueries({ queryKey: ['approvals-approved'] });
    },
    onError: () => {
      message.error('操作失败');
    },
  });

  const pendingColumns = [
    {
      title: '项目',
      dataIndex: 'project_name',
      key: 'project_name',
      render: (text: string) => (
        <Space>
          <FileTextOutlined style={{ color: '#64748B' }} />
          <span style={{ fontWeight: 500 }}>{text || '-'}</span>
        </Space>
      ),
    },
    { title: '申请类型', dataIndex: 'type', key: 'type' },
    { title: '申请人', dataIndex: 'applicant_name', key: 'applicant_name' },
    { title: '申请时间', dataIndex: 'applied_at', key: 'applied_at', render: (val: string) => val?.split('T')[0] || '-' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: () => <Tag color="processing">待审批</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: { id: number }) => (
        <Space>
          <Button
            size="small"
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => {
              setSelectedItem(record.id);
              setReviewModalVisible(true);
            }}
          >
            审批
          </Button>
          <Button
            size="small"
            danger
            icon={<CloseOutlined />}
            onClick={() => {
              if (window.confirm('确定要驳回吗?')) {
                rejectMutation.mutate(record.id);
              }
            }}
          >
            驳回
          </Button>
        </Space>
      ),
    },
  ];

  const approvedColumns = [
    { title: '项目', dataIndex: 'project_name', key: 'project_name', render: (text: string) => <span style={{ fontWeight: 500 }}>{text || '-'}</span> },
    { title: '申请类型', dataIndex: 'type', key: 'type' },
    { title: '申请人', dataIndex: 'applicant_name', key: 'applicant_name' },
    { title: '申请时间', dataIndex: 'applied_at', key: 'applied_at', render: (val: string) => val?.split('T')[0] || '-' },
    { title: '审批结果', dataIndex: 'result', key: 'result', render: (r: string) => <Tag color={r === 'approved' ? 'green' : 'red'}>{r === 'approved' ? '通过' : '驳回'}</Tag> },
    { title: '审批时间', dataIndex: 'processed_at', key: 'processed_at', render: (val: string) => val?.split('T')[0] || '-' },
    { title: '操作', key: 'action', render: () => <Button size="small" icon={<EyeOutlined />}>查看</Button> },
  ];

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'pending',
              label: `我的待办 (${pendingData?.count || 0})`,
              children: (
                <Table
                  columns={pendingColumns}
                  dataSource={currentData || []}
                  rowKey="id"
                  pagination={false}
                  loading={pendingLoading}
                />
              ),
            },
            {
              key: 'approved',
              label: `我的已办 (${approvedData?.count || 0})`,
              children: (
                <Table
                  columns={approvedColumns}
                  dataSource={currentData || []}
                  rowKey="id"
                  pagination={false}
                  loading={approvedLoading}
                />
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title="审批"
        open={reviewModalVisible}
        onCancel={() => {
          setReviewModalVisible(false);
          setComment('');
        }}
        footer={null}
      >
        <div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: '#64748B', marginBottom: 4 }}>审批意见</div>
            <TextArea
              rows={4}
              placeholder="请输入审批意见"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
          </div>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={() => {
              setReviewModalVisible(false);
              setComment('');
            }}>
              取消
            </Button>
            <Button
              danger
              onClick={() => {
                if (selectedItem) {
                  rejectMutation.mutate(selectedItem);
                }
              }}
              loading={rejectMutation.isPending}
            >
              驳回
            </Button>
            <Button
              type="primary"
              onClick={() => {
                if (selectedItem) {
                  approveMutation.mutate(selectedItem);
                }
              }}
              loading={approveMutation.isPending}
            >
              通过
            </Button>
          </Space>
        </div>
      </Modal>
    </div>
  );
}