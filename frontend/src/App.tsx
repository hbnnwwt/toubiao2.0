import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { useUserStore } from './api/store/userStore';
import MainLayout from './components/Layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import Bidding from './pages/Bidding';
import Qualifications from './pages/Qualifications';
import Matching from './pages/Matching';
import Documents from './pages/Documents';
import Approvals from './pages/Approvals';
import './styles/global.css';

const theme = {
  token: {
    colorPrimary: '#64748B',
    colorLink: '#F97316',
    borderRadius: 8,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
};

// 认证保护组件
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <ConfigProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<ProjectList />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="bidding/:projectId?" element={<Bidding />} />
            <Route path="qualifications" element={<Qualifications />} />
            <Route path="matching" element={<Matching />} />
            <Route path="documents" element={<Documents />} />
            <Route path="approvals" element={<Approvals />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;