# 文档上传功能设计

**日期**: 2026-04-01
**状态**: 已批准

## 1. 需求概述

实现可复用的文档上传组件，支持对话框和拖拽两种上传方式，可关联项目或投标。

## 2. 技术方案

### 2.1 组件接口

```typescript
interface UploadModalProps {
  visible: boolean;                    // 控制弹窗显隐
  onClose: () => void;                // 关闭弹窗回调
  onSuccess: (doc: Document) => void; // 上传成功回调，返回文档对象
  projectId?: number;                 // 可选的关联项目ID
  bidId?: number;                     // 可选的关联投标ID
  maxSize?: number;                   // 最大文件大小(字节)，默认10MB
  allowedTypes?: string[];            // 允许的文件类型扩展名
}
```

### 2.2 组件功能

| 功能 | 说明 |
|------|------|
| 对话框上传 | 弹窗填写文件名、选择文档类型、上传文件 |
| 拖拽上传 | 支持拖拽文件到上传区域 |
| 进度显示 | 显示上传进度百分比 |
| 文件验证 | 验证文件大小和类型 |
| 关联选择 | 可选择关联到项目或投标 |
| 成功回调 | 上传完成后通过回调返回文档对象 |

### 2.3 文件结构

```
frontend/src/components/
└── UploadModal.tsx  (新建)
```

### 2.4 后端接口

使用现有 `POST /api/documents/` 接口，FormData 格式：
- `name`: 文件名
- `file`: 文件对象
- `document_type`: 文档类型
- `project`: 项目ID (可选)
- `bid_submission`: 投标ID (可选)

## 3. 使用场景

### 3.1 Documents.tsx (通用文档)
```typescript
import UploadModal from '../components/UploadModal';

<UploadModal
  visible={uploadModalVisible}
  onClose={() => setUploadModalVisible(false)}
  onSuccess={(doc) => {
    message.success('上传成功');
    queryClient.invalidateQueries({ queryKey: ['documents'] });
  }}
/>
```

### 3.2 Bidding.tsx (投标附件)
```typescript
<UploadModal
  visible={uploadModalVisible}
  onClose={() => setUploadModalVisible(false)}
  onSuccess={(doc) => {
    message.success('上传成功');
    // 刷新投标文件列表
  }}
  bidId={currentBid?.id}
  projectId={selectedProjectId}
/>
```

## 4. 配置项

| 配置 | 默认值 | 说明 |
|------|--------|------|
| maxSize | 10MB | 最大文件大小 |
| allowedTypes | ['pdf','doc','docx','xls','xlsx','zip','rar','png','jpg','jpeg'] | 允许的文件类型 |

## 5. 验收标准

- [ ] UploadModal 组件创建完成
- [ ] 对话框上传功能正常
- [ ] 拖拽上传功能正常
- [ ] 文件大小验证生效
- [ ] 文件类型验证生效
- [ ] 上传进度正确显示
- [ ] 成功回调正常触发
- [ ] Documents 页面集成成功
- [ ] Bidding 页面集成成功
