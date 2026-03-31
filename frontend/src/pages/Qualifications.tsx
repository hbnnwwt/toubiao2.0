import { useState } from 'react';
import { Card, Tabs, Table, Tag, Button, Space, Modal, Form, Input, InputNumber, Select, Upload, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const mockQualifications = [
  { id: 1, name: '建筑工程施工总承包特级', type: '资质', level: '特级', expireDate: '2028-12-31', status: '有效' },
  { id: 2, name: '安全生产许可证', type: '许可', level: '-', expireDate: '2027-06-30', status: '有效' },
  { id: 3, name: 'ISO9001质量管理体系', type: '认证', level: '-', expireDate: '2027-03-15', status: '有效' },
];

const mockTeamMembers = [
  { id: 1, name: '张三', position: '项目经理', cert: '一级建造师', expireDate: '2026-09-30' },
  { id: 2, name: '李四', position: '技术负责人', cert: '高级工程师', expireDate: '2027-12-31' },
  { id: 3, name: '王五', position: '安全员', cert: '安全员C证', expireDate: '2026-06-15' },
];

const mockCases = [
  { id: 1, name: '市政府大楼一期', type: '基础设施', amount: 5000, year: 2024, result: '中标' },
  { id: 2, name: '商业综合体', type: '商业', amount: 8000, year: 2023, result: '中标' },
  { id: 3, name: '产业园一期', type: '工业', amount: 3000, year: 2023, result: '未中' },
];

export default function Qualifications() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'qualification' | 'member' | 'case'>('qualification');

  const qualificationColumns = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '类型', dataIndex: 'type', key: 'type' },
    { title: '等级', dataIndex: 'level', key: 'level' },
    { title: '有效期至', dataIndex: 'expireDate', key: 'expireDate' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color="green">{s}</Tag> },
    { title: '操作', key: 'action', render: () => <Space><Button size="small" icon={<EyeOutlined />}>查看</Button><Button size="small" icon={<EditOutlined />}>编辑</Button></Space> },
  ];

  const memberColumns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '职位', dataIndex: 'position', key: 'position' },
    { title: '证书', dataIndex: 'cert', key: 'cert' },
    { title: '有效期至', dataIndex: 'expireDate', key: 'expireDate' },
    { title: '操作', key: 'action', render: () => <Space><Button size="small" icon={<EditOutlined />}>编辑</Button><Button size="small" danger icon={<DeleteOutlined />}>删除</Button></Space> },
  ];

  const caseColumns = [
    { title: '项目名称', dataIndex: 'name', key: 'name' },
    { title: '类型', dataIndex: 'type', key: 'type' },
    { title: '金额(万)', dataIndex: 'amount', key: 'amount' },
    { title: '年份', dataIndex: 'year', key: 'year' },
    { title: '结果', dataIndex: 'result', key: 'result', render: (r: string) => <Tag color={r === '中标' ? 'green' : 'red'}>{r}</Tag> },
    { title: '操作', key: 'action', render: () => <Space><Button size="small" icon={<EyeOutlined />}>查看</Button><Button size="small" icon={<EditOutlined />}>编辑</Button></Space> },
  ];

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
                  <Table columns={qualificationColumns} dataSource={mockQualifications} rowKey="id" pagination={false} />
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
                  <Table columns={memberColumns} dataSource={mockTeamMembers} rowKey="id" pagination={false} />
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
                  <Table columns={caseColumns} dataSource={mockCases} rowKey="id" pagination={false} />
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
                <InputNumber style={{ width: '100%' }} placeholder="请输入金额" />
              </Form.Item>
              <Form.Item label="年份">
                <InputNumber style={{ width: '100%' }} placeholder="请输入年份" />
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
