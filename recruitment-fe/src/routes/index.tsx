import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import EmployerLayout from '@/layouts/EmployerLayout';
import AdminLayout from '@/layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import { Role } from '@/types/role';
import { useAuthStore } from '@/store/useAuthStore';
import { useUser } from '@/modules/user/hooks/useUser';
import { Loader2 } from 'lucide-react';

// Import các trang
import { HomePage } from '@/modules/home/pages/HomePage';
import { JobDetailPage } from '@/modules/home/pages/JobDetailPage';
import { LoginPage } from '@/modules/auth/pages/LoginPage';
import { RegisterPage } from '@/modules/auth/pages/RegisterPage';
import { EmployerDashboard } from '@/modules/employer/pages/EmployerDashboard';
import { CompanyProfilePage } from '@/modules/employer/pages/CompanyProfilePage';
import { ManageJobsPage } from '@/modules/employer/pages/ManageJobsPage';
import { EmployerSetupPage } from '@/modules/employer/pages/EmployerSetupPage';
import { AdminVerifyCompany } from '@/modules/admin/pages/AdminVerifyCompany';
import { AdminUserList } from '@/modules/admin/pages/AdminUserList';
import { PendingApprovalPage } from '@/modules/employer/pages/PendingApprovalPage';
import { BlacklistPage } from '@/modules/employer/pages/BlacklistPage';
import { RejectedPage } from '@/modules/employer/pages/RejectedPage';
import { ManageMembers } from '@/modules/employer/pages/ManageMembers';
import { JoinPendingPage } from '@/modules/employer/pages/JoinPendingPage';
import { ProfilePage } from '@/modules/user/pages/ProfilePage';
import { AdminVerifyJobs } from '@/modules/admin/pages/AdminVerifyJobs';
import { EmployerManageJobs } from '@/modules/employer/pages/EmployerManageJobs';

const GuardLoader = ({ message }: { message: string }) => (
  <div className="h-screen w-full flex flex-col items-center justify-center bg-[#f4f7f6] gap-4 text-center">
    <Loader2 className="w-12 h-12 text-[#00b14f] animate-spin" />
    <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-[10px]">
      {message}
    </p>
  </div>
);

/**
 * 1. AuthedRedirect: Dùng bọc trang Login/Register.
 * NẾU ĐÃ LOGIN: Đẩy ra khỏi đây ngay lập tức về đúng Dashboard hoặc Trang chủ.
 */
const AuthedRedirect = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  const { data: user, isLoading } = useUser();

  if (!isAuthenticated) return <>{children}</>;
  if (isLoading)
    return <GuardLoader message="Đang xác thực phiên đăng nhập..." />;

  if (user) {
    if (user.role === Role.ADMIN)
      return <Navigate to="/admin/companies" replace />;
    if (user.role === Role.EMPLOYER)
      return <Navigate to="/employer/dashboard" replace />;
    // Candidate đã login thì đẩy về trang chủ, không cho ở lại trang Login
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

/**
 * 2. RootRedirect: Dùng cho trang chủ "/".
 * Admin/Employer vào trang chủ sẽ bị đẩy vào Dashboard. Candidate/Khách thì ở lại xem Job.
 */
const RootRedirect = () => {
  const { data: user, isLoading } = useUser();
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <HomePage />;
  if (isLoading) return <GuardLoader message="Đang tải dữ liệu hệ thống..." />;

  if (user?.role === Role.ADMIN)
    return <Navigate to="/admin/companies" replace />;
  if (user?.role === Role.EMPLOYER)
    return <Navigate to="/employer/dashboard" replace />;

  return <HomePage />;
};

/**
 * 3. EmployerGuard: Xử lý State Machine cho Employer
 */
const EmployerGuard = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading, isError } = useUser();

  if (isLoading)
    return <GuardLoader message="Đồng bộ trạng thái doanh nghiệp..." />;
  if (isError || !user) return <Navigate to="/login" replace />;

  if (user.role === Role.EMPLOYER) {
    if (user.companyId) {
      if (user.companyStatus === 'PENDING') return <PendingApprovalPage />;
      if (user.companyStatus === 'REJECTED') return <RejectedPage />;
      if (user.companyStatus === 'BLACKLISH') return <BlacklistPage />;
      return <>{children}</>;
    }
    if (user.pendingJoinRequest) return <JoinPendingPage />;
    return <EmployerSetupPage />;
  }

  // Nếu nhầm role, đẩy về trang chủ
  return <Navigate to="/" replace />;
};

/**
 * 4. OwnerRoute: Chỉ cho phép Sếp truy cập
 */
const OwnerRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useUser();
  if (isLoading) return <GuardLoader message="Xác thực quyền quản trị..." />;
  if (!user?.isOwner) return <Navigate to="/employer/dashboard" replace />;
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '', element: <RootRedirect /> },
      { path: 'jobs/:id', element: <JobDetailPage /> },
      {
        path: 'profile',
        element: (
          <ProtectedRoute
            allowedRoles={[Role.CANDIDATE, Role.EMPLOYER, Role.ADMIN]}
          >
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/employer',
    element: (
      <ProtectedRoute allowedRoles={[Role.EMPLOYER]}>
        <EmployerGuard>
          <EmployerLayout />
        </EmployerGuard>
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <EmployerDashboard /> },
      { path: 'company', element: <CompanyProfilePage /> },
      { path: 'jobs', element: <EmployerManageJobs /> },
      { path: 'jobs/create', element: <ManageJobsPage /> },
      {
        path: 'members',
        element: (
          <OwnerRoute>
            <ManageMembers />
          </OwnerRoute>
        ),
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'companies', element: <AdminVerifyCompany /> },
      { path: 'jobs', element: <AdminVerifyJobs /> },
      { path: 'users', element: <AdminUserList /> },
    ],
  },
  {
    path: '/login',
    element: (
      <AuthedRedirect>
        <LoginPage />
      </AuthedRedirect>
    ),
  },
  {
    path: '/register',
    element: (
      <AuthedRedirect>
        <RegisterPage />
      </AuthedRedirect>
    ),
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
