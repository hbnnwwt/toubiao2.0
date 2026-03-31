'use client';

import { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge } from 'antd';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  House,
  FolderSimple,
  FileText,
  CheckSquare,
  MagnifyingGlass,
  Users,
  Bell,
  List,
  CaretLeft,
  Gear,
  SignOut,
} from '@phosphor-icons/react';

const { Header, Sider, Content } = Layout;

type MenuItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
};

const menuItems: MenuItem[] = [
  { key: '/dashboard', icon: <House weight="fill" />, label: '工作台' },
  { key: '/projects', icon: <FolderSimple weight="fill" />, label: '招标项目' },
  { key: '/bidding', icon: <FileText weight="fill" />, label: '投标文件' },
  { key: '/qualifications', icon: <Users weight="fill" />, label: '企业资质' },
  { key: '/matching', icon: <MagnifyingGlass weight="fill" />, label: '智能匹配' },
  { key: '/documents', icon: <FileText weight="fill" />, label: '文档中心' },
  { key: '/approvals', icon: <CheckSquare weight="fill" />, label: '审批中心' },
];

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userMenuItems = [
    {
      key: 'profile',
      icon: <Gear size={16} />,
      label: '个人设置',
    },
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <SignOut size={16} />,
      label: '退出登录',
      danger: true,
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Layout className="min-h-[100dvh]">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="!bg-white !border-r border-slate-200/50 !shadow-none"
        width={260}
        collapsedWidth={80}
      >
        <div className="h-16 flex items-center justify-center border-b border-slate-100">
          {collapsed ? (
            <span className="text-xl font-bold text-primary tracking-tight">TB</span>
          ) : (
            <span className="text-base font-bold text-slate-700 tracking-tight">
              招投标平台
            </span>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="!border-none !py-3"
          style={{ background: 'transparent' }}
        />
      </Sider>
      <Layout>
        <Header className="!bg-white !px-6 !flex !items-center !justify-between !shadow-none !border-b border-slate-100">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            {collapsed ? <List /> : <CaretLeft />}
          </button>
          <div className="flex items-center gap-5">
            <Badge count={3} size="small">
              <button className="text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">
                <Bell size={20} weight="fill" />
              </button>
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <button className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <Avatar className="!bg-primary !text-white font-medium">张</Avatar>
                <span className="text-slate-700 font-medium text-sm">张经理</span>
              </button>
            </Dropdown>
          </div>
        </Header>
        <Content className="!p-6 md:!p-8">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
