'use client';

import { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { User, Lock } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (_values: { username: string; password: string }) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('登录成功');
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-[100dvh] flex">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-96 h-96 bg-cta/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24">
          <div className="mb-12">
            <h1 className="text-4xl xl:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
              建筑招投标
              <br />
              <span className="text-cta">智能化平台</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-md">
              数字化、自动化、智能化，提升投标效率
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cta flex items-center justify-center text-white font-bold text-lg">
                1
              </div>
              <span className="text-slate-300">智能匹配项目，精准定位商机</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg">
                2
              </div>
              <span className="text-slate-300">AI 辅助标书编制，省时省力</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success flex items-center justify-center text-white font-bold text-lg">
                3
              </div>
              <span className="text-slate-300">全流程管理，审批高效透明</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-white font-bold text-2xl mb-4">
              TB
            </div>
            <h1 className="text-2xl font-bold text-slate-800">招投标平台</h1>
          </div>

          <Card className="!shadow-xl !border-0">
            <div className="text-center mb-8">
              <div className="hidden lg:flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-white font-bold text-2xl mx-auto mb-4">
                TB
              </div>
              <h2 className="text-xl font-semibold text-slate-800">欢迎登录</h2>
              <p className="text-slate-500 mt-1 text-sm">请输入账号密码登录系统</p>
            </div>

            <Form
              name="login"
              onFinish={onFinish}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入账号' }]}
              >
                <Input
                  prefix={<User className="text-slate-400" size={18} />}
                  placeholder="请输入账号"
                  className="!rounded-xl"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  prefix={<Lock className="text-slate-400" size={18} />}
                  placeholder="请输入密码"
                  className="!rounded-xl"
                />
              </Form.Item>

              <Form.Item className="!mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  className="!h-12 !rounded-xl !font-semibold"
                >
                  登 录
                </Button>
              </Form.Item>
            </Form>

            <div className="text-center mt-6 text-slate-400 text-sm">
              还没有账号？联系管理员开通
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
