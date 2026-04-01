import { useState } from 'react';
import { Modal, Form, Select, Upload, Button, Progress, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { documentsApi, type Document } from '../api';

const { Option } = Select;

interface UploadModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (doc: Document) => void;
  projectId?: number;
  bidId?: number;
  maxSize?: number;
  allowedTypes?: string[];
}

const docTypeOptions = [
  { value: 'tender', label: '招标文件' },
  { value: 'technical', label: '技术方案' },
  { value: 'qualification', label: '资质文件' },
  { value: 'business', label: '商务文件' },
  { value: 'case', label: '业绩材料' },
  { value: 'other', label: '其他' },
];

export default function UploadModal({
  visible,
  onClose,
  onSuccess,
  projectId,
  bidId,
  maxSize = 10 * 1024 * 1024,
  allowedTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar', 'png', 'jpg', 'jpeg'],
}: UploadModalProps) {
  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file) {
      message.warning('请选择文件');
      return;
    }

    if (file.size > maxSize) {
      message.error(`文件大小不能超过 ${maxSize / 1024 / 1024}MB`);
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!allowedTypes.includes(ext)) {
      message.error(`文件类型不支持，请上传 ${allowedTypes.join(', ')} 格式`);
      return;
    }

    try {
      setUploading(true);
      setProgress(30);

      const doc = await documentsApi.upload({
        name: file.name,
        file,
        document_type: form.getFieldValue('doc_type') || 'other',
        project_id: projectId,
        bid_id: bidId,
      });

      setProgress(100);
      message.success('上传成功');
      onSuccess(doc);
      handleClose();
    } catch (error) {
      message.error('上传失败');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setFile(null);
    setProgress(0);
    onClose();
  };

  const uploadProps = {
    accept: allowedTypes.map(t => `.${t}`).join(','),
    beforeUpload: (f: File) => {
      setFile(f);
      return false;
    },
    showUploadList: false,
    maxCount: 1,
  };

  return (
    <Modal
      title="上传文档"
      open={visible}
      onCancel={handleClose}
      footer={[
        <Button key="cancel" onClick={handleClose} disabled={uploading}>
          取消
        </Button>,
        <Button
          key="upload"
          type="primary"
          onClick={handleUpload}
          loading={uploading}
          disabled={!file}
        >
          {uploading ? '上传中...' : '上传'}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="文档类型" name="doc_type" rules={[{ required: true, message: '请选择文档类型' }]}>
          <Select placeholder="请选择文档类型">
            {docTypeOptions.map(opt => (
              <Option key={opt.value} value={opt.value}>{opt.label}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="文件">
          <Upload.Dragger {...uploadProps}>
            <p><InboxOutlined style={{ fontSize: 32, color: '#1890ff' }} /></p>
            <p style={{ margin: '8px 0' }}>点击或拖拽文件到此处上传</p>
            <p style={{ color: '#8c8c8c', fontSize: 12 }}>
              支持格式: {allowedTypes.join(', ')}，最大 {maxSize / 1024 / 1024}MB
            </p>
          </Upload.Dragger>
          {file && (
            <div style={{ marginTop: 8, color: '#1890ff' }}>
              已选择: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </Form.Item>

        {uploading && (
          <Progress percent={progress} status="active" />
        )}
      </Form>
    </Modal>
  );
}