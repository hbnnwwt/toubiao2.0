# 建筑招投标智能化平台

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-6+-1890FF?style=flat&logo=antdesign)](https://ant.design)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4+-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com)

数字化、自动化、智能化，提升投标效率。

## 技术栈

### 前端
- React 18 + TypeScript
- Vite (构建工具)
- Ant Design 6 (UI组件库)
- Tailwind CSS 4 (样式)
- React Router DOM (路由)
- Zustand (状态管理)
- TanStack Query (数据获取)
- Phosphor Icons (图标)

### 后端 (待实现)
- Django 5.x + Django REST Framework
- PostgreSQL / MySQL

## 功能模块

- **项目信息管理** - 招标项目信息录入、分类、状态跟踪
- **投标文件编制** - 商务标/技术标编辑、模板库管理
- **智能匹配** - 企业能力画像、项目需求画像、匹配度计算
- **风险评估** - 项目风险识别、等级评定、应对建议
- **数据分析** - 可视化仪表盘、中标率分析、趋势预测
- **文档管理** - 文档集中管理、OCR预处理、全文检索
- **审批流程** - 多级审批工作流、审批历史追溯
- **用户权限** - 多级角色、精细权限控制

## 快速开始

### 前端

```bash
cd frontend
npm install
npm run dev
```

访问 http://localhost:5173

### 开发

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
├── frontend/              # 前端项目
│   ├── src/
│   │   ├── components/   # 公共组件
│   │   ├── pages/        # 页面组件
│   │   ├── api/          # API 接口
│   │   ├── store/        # 状态管理
│   │   ├── styles/       # 样式
│   │   └── types/        # 类型定义
│   └── package.json
├── design-system/        # 设计系统
└── docs/                  # 文档
```

## License

MIT
