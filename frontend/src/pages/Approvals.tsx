import { useState } from 'react';
import { Card, Tabs, Table, Tag, Button, Space, Modal, Input, message } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const mockPending = [
  { id: 1, project: '市政府大楼', type: '投标提交', applicant: '张三', applyDate: '2026-03-30 14:30', status: 'pending' },
  { id: 2, project: '商业综合体', type: '资质补充', applicant: '李四', applyDate: '2026-03-30 10:15', status: 'pending' },
];

const mockApproved = [
  { id: 3, project: '产业园', type: '中标确认', applicant: '王五', applyDate: '2026-03-29 16:20', result: '通过', resultDate: '2026-03-29 17:00' },
  { id: 4, project: '住宅小区', type: '项目立项', applicant: '张三', applyDate: '2026-03-28 09:00', result: '通过', resultDate: '2026-03-28 10:30' },
];

export default function Approvals() {
  const [activeTab, setActiveTab] = useState('pending');
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const pendingColumns = [
    {
      title: '项目',
      dataIndex: 'project',
      key: 'project',
      render: (text: string) => (
        <Space>
          <FileTextOutlined style={{ color: '#64748B' }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    { title: '申请类型', dataIndex: 'type', key: 'type' },
    { title: '申请人', dataIndex: 'applicant', key: 'applicant' },
    { title: '申请时间', dataIndex: 'applyDate', key: 'applyDate' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: () => <Tag color="processing">待审批</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button
            size="small"
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => {
              setSelectedItem(record);
              setReviewModalVisible(true);
            }}
          >
            审批
          </Button>
          <Button size="small" danger icon={<CloseOutlined />}>
            驳回
          </Button>
        </Space>
      ),
    },
  ];

  const approvedColumns = [
    { title: '项目', dataIndex: 'project', key: 'project', render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span> },
    { title: '申请类型', dataIndex: 'type', key: 'type' },
    { title: '申请人', dataIndex: 'applicant', key: 'applicant' },
    { title: '申请时间', dataIndex: 'applyDate', key: 'applyDate' },
    { title: '审批结果', dataIndex: 'result', key: 'result', render: (r: string) => <Tag color={r === '通过' ? 'green' : 'red'}>{r}</Tag> },
    { title: '审批时间', dataIndex: 'resultDate', key: 'resultDate' },
    { title: '操作', key: 'action', render: () => <Button size="small" icon={<EyeOutlined />}>查看</Button> },
  ];

  return (
    <div>
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'pending',
              label: `我的待办 (${mockPending.length})`,
              children: (
                <Table
                  columns={pendingColumns}
                  dataSource={mockPending}
                  rowKey="id"
                  pagination={false}
                />
              ),
            },
            {
              key: 'approved',
              label: `我的已办 (${mockApproved.length})`,
              children: (
                <Table
                  columns={approvedColumns}
                  dataSource={mockApproved}
                  rowKey="id"
                  pagination={false}
                />
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title="审批"
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        footer={null}
      >
        {selectedItem && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: '#64748B', marginBottom: 4 }}>项目</div>
              <div style={{ fontWeight: 500 }}>{selectedItem.project}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: '#64748B', marginBottom: 4 }}>申请类型</div>
              <div>{selectedItem.type}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: '#64748B', marginBottom: 4 }}>审批意见</div>
              <TextArea rows={4} placeholder="请输入审批意见" />
            </div>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setReviewModalVisible(false)}>取消</Button>
              <Button
                danger
                onClick={() => {
                  message.success('已驳回');
                  setReviewModalVisible(false);
                }}
              >
                驳回
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  message.success('已通过');
                  setReviewModalVisible(false);
                }}
              >
                通过
              </Button>
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
}
