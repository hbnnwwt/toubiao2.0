import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Tabs, Table, Tag, Button, Space, Modal, Form, Input, Select, Upload, message, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import { biddingApi } from '../api';

const { Dragger } = Upload;

export default function Qualifications() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'qualification' | 'member' | 'case'>('qualification');

  // 获取资质列表
  const { data: qualifications, isLoading: qualLoading } = useQuery({
    queryKey: ['qualifications'],
    queryFn: () => biddingApi.getQualifications(),
  });

  // 获取人员列表
  const { data: members, isLoading: memberLoading } = useQuery({
    queryKey: ['members'],
    queryFn: () => biddingApi.getMembers(),
  });

  // 获取案例列表
  const { data: cases, isLoading: caseLoading } = useQuery({
    queryKey: ['cases'],
    queryFn: () => biddingApi.getCases(),
  });

  const isLoading = qualLoading || memberLoading || caseLoading;

  const qualificationColumns = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '类型', dataIndex: 'type', key: 'type' },
    { title: '等级', dataIndex: 'level', key: 'level' },
    { title: '有效期至', dataIndex: 'expire_date', key: 'expire_date' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color="green">{s || '有效'}</Tag> },
    { title: '操作', key: 'action', render: () => <Space><Button size="small" icon={<EyeOutlined />}>查看</Button><Button size="small" icon={<EditOutlined />}>编辑</Button></Space> },
  ];

  const memberColumns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '职位', dataIndex: 'position', key: 'position' },
    { title: '证书', dataIndex: 'cert', key: 'cert' },
    { title: '有效期至', dataIndex: 'expire_date', key: 'expire_date' },
    { title: '操作', key: 'action', render: () => <Space><Button size="small" icon={<EditOutlined />}>编辑</Button><Button size="small" danger icon={<DeleteOutlined />}>删除</Button></Space> },
  ];

  const caseColumns = [
    { title: '项目名称', dataIndex: 'name', key: 'name' },
    { title: '类型', dataIndex: 'type', key: 'type' },
    { title: '金额(万)', dataIndex: 'amount', key: 'amount' },
    { title: '年份', dataIndex: 'year', key: 'year' },
    { title: '结果', dataIndex: 'result', key: 'result', render: (r: string) => <Tag color={r === '中标' ? 'green' : 'red'}>{r || '-'}</Tag> },
    { title: '操作', key: 'action', render: () => <Space><Button size="small" icon={<EyeOutlined />}>查看</Button><Button size="small" icon={<EditOutlined />}>编辑</Button></Space> },
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
          items={[
            {
              key: 'qualifications',
              label: '企业资质',
              children: (
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setModalType('qualification'); setModalVisible(true); }}>
                      新增资质
                    </Button>
                  </div>
                  <Table
                    columns={qualificationColumns}
                    dataSource={qualifications || []}
                    rowKey="id"
                    pagination={false}
                    loading={qualLoading}
                  />
                </div>
              ),
            },
            {
              key: 'team',
              label: '团队人员',
              children: (
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setModalType('member'); setModalVisible(true); }}>
                      新增人员
                    </Button>
                  </div>
                  <Table
                    columns={memberColumns}
                    dataSource={members || []}
                    rowKey="id"
                    pagination={false}
                    loading={memberLoading}
                  />
                </div>
              ),
            },
            {
              key: 'cases',
              label: '业绩案例',
              children: (
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setModalType('case'); setModalVisible(true); }}>
                      新增业绩
                    </Button>
                  </div>
                  <Table
                    columns={caseColumns}
                    dataSource={cases || []}
                    rowKey="id"
                    pagination={false}
                    loading={caseLoading}
                  />
                </div>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title={modalType === 'qualification' ? '新增资质' : modalType === 'member' ? '新增人员' : '新增业绩'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical">
          {modalType === 'qualification' && (
            <>
              <Form.Item label="资质名称" rules={[{ required: true }]}>
                <Input placeholder="请输入资质名称" />
              </Form.Item>
              <Form.Item label="类型">
                <Select placeholder="请选择类型">
                  <Select.Option value="资质">资质</Select.Option>
                  <Select.Option value="许可">许可</Select.Option>
                  <Select.Option value="认证">认证</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="等级">
                <Select placeholder="请选择等级">
                  <Select.Option value="特级">特级</Select.Option>
                  <Select.Option value="一级">一级</Select.Option>
                  <Select.Option value="二级">二级</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="有效期至">
                <Input type="date" />
              </Form.Item>
              <Form.Item label="资质文件">
                <Dragger>
                  <p><UploadOutlined /> 点击或拖拽文件上传</p>
                </Dragger>
              </Form.Item>
            </>
          )}
          {modalType === 'member' && (
            <>
              <Form.Item label="姓名" rules={[{ required: true }]}>
                <Input placeholder="请输入姓名" />
              </Form.Item>
              <Form.Item label="职位">
                <Input placeholder="请输入职位" />
              </Form.Item>
              <Form.Item label="证书">
                <Input placeholder="请输入证书名称" />
              </Form.Item>
              <Form.Item label="有效期至">
                <Input type="date" />
              </Form.Item>
            </>
          )}
          {modalType === 'case' && (
            <>
              <Form.Item label="项目名称" rules={[{ required: true }]}>
                <Input placeholder="请输入项目名称" />
              </Form.Item>
              <Form.Item label="项目类型">
                <Select placeholder="请选择类型">
                  <Select.Option value="基础设施">基础设施</Select.Option>
                  <Select.Option value="商业">商业</Select.Option>
                  <Select.Option value="工业">工业</Select.Option>
                  <Select.Option value="住宅">住宅</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="金额(万)">
                <Input type="number" placeholder="请输入金额" />
              </Form.Item>
              <Form.Item label="年份">
                <Input type="number" placeholder="请输入年份" />
              </Form.Item>
            </>
          )}
          <Form.Item>
            <Button type="primary" block onClick={() => { message.success('保存成功'); setModalVisible(false); }}>
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}