import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import EmployerLayout from '@/layouts/EmployerLayout';
import AdminLayout from '@/layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import { Role } from '@/types/role';
import { useAuthStore } from '@/store/useAuthStore';
import { useUser } from '@/modules/user/hooks/useUser';
import { Loader2 } from 'lucide-react';
import { GlobalErrorFallback } from '@/components/shared/GlobalErrorFallback';
import { useRouteError } from 'react-router-dom';

const RouterErrorElement = () => {
  const error = useRouteError();
  return (
    <GlobalErrorFallback
      error={error instanceof Error ? error : new Error('Unknown Error')}
      resetErrorBoundary={() => window.location.reload()}
    />
  );
};

// Lazy load các trang
const HomePage = lazy(() => import('@/modules/home/pages/HomePage').then(m => ({ default: m.HomePage })));
const JobDetailPage = lazy(() => import('@/modules/home/pages/JobDetailPage').then(m => ({ default: m.JobDetailPage })));
const LoginPage = lazy(() => import('@/modules/auth/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/modules/auth/pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const EmployerDashboard = lazy(() => import('@/modules/employer/pages/EmployerDashboard').then(m => ({ default: m.EmployerDashboard })));
const CompanyProfilePage = lazy(() => import('@/modules/employer/pages/CompanyProfilePage').then(m => ({ default: m.CompanyProfilePage })));
const ManageJobsPage = lazy(() => import('@/modules/employer/pages/ManageJobsPage').then(m => ({ default: m.ManageJobsPage })));
const EmployerSetupPage = lazy(() => import('@/modules/employer/pages/EmployerSetupPage').then(m => ({ default: m.EmployerSetupPage })));
const AdminVerifyCompany = lazy(() => import('@/modules/admin/pages/AdminVerifyCompany').then(m => ({ default: m.AdminVerifyCompany })));
const AdminUserList = lazy(() => import('@/modules/admin/pages/AdminUserList').then(m => ({ default: m.AdminUserList })));
const PendingApprovalPage = lazy(() => import('@/modules/employer/pages/PendingApprovalPage').then(m => ({ default: m.PendingApprovalPage })));
const BlacklistPage = lazy(() => import('@/modules/employer/pages/BlacklistPage').then(m => ({ default: m.BlacklistPage })));
const RejectedPage = lazy(() => import('@/modules/employer/pages/RejectedPage').then(m => ({ default: m.RejectedPage })));
const ManageMembers = lazy(() => import('@/modules/employer/pages/ManageMembers').then(m => ({ default: m.ManageMembers })));
const JoinPendingPage = lazy(() => import('@/modules/employer/pages/JoinPendingPage').then(m => ({ default: m.JoinPendingPage })));
const ProfilePage = lazy(() => import('@/modules/user/pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const AdminVerifyJobs = lazy(() => import('@/modules/admin/pages/AdminVerifyJobs').then(m => ({ default: m.AdminVerifyJobs })));
const AdminDashboard = lazy(() => import('@/modules/admin/pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminJobCategory = lazy(() => import('@/modules/admin/pages/AdminJobCategory').then(m => ({ default: m.AdminJobCategory })));
const EmployerManageJobs = lazy(() => import('@/modules/employer/pages/EmployerManageJobs').then(m => ({ default: m.EmployerManageJobs })));
const AnalyticsDashboard = lazy(() => import('@/modules/employer/pages/AnalyticsDashboard').then(m => ({ default: m.AnalyticsDashboard })));
const MyResumesPage = lazy(() => import('@/modules/resume/pages/MyResumesPage').then(m => ({ default: m.MyResumesPage })));
const MyApplicationsPage = lazy(() => import('@/modules/application/pages/MyApplicationsPage').then(m => ({ default: m.MyApplicationsPage })));
const CandidateDetailPage = lazy(() => import('@/modules/employer/pages/candidate/CandidateDetailPage').then(m => ({ default: m.CandidateDetailPage })));
const EmployerCandidatesPage = lazy(() => import('@/modules/employer/pages/EmployerCandidatesPage').then(m => ({ default: m.EmployerCandidatesPage })));
const MyInterviewsPage = lazy(() => import('@/modules/interview/pages/MyInterviewsPage').then(m => ({ default: m.MyInterviewsPage })));
const EmployerInterviewsPage = lazy(() => import('@/modules/employer/pages/EmployerInterviewsPage').then(m => ({ default: m.EmployerInterviewsPage })));
const SavedJobsPage = lazy(() => import('@/modules/saved-items/pages/SavedJobsPage'));
const SavedCandidatesPage = lazy(() => import('@/modules/saved-items/pages/SavedCandidatesPage'));
const CompaniesPage = lazy(() => import('@/modules/company/pages/CompaniesPage').then(m => ({ default: m.CompaniesPage })));
const CompanyDetailPage = lazy(() => import('@/modules/company/pages/CompanyDetailPage').then(m => ({ default: m.CompanyDetailPage })));
const JobSearchPage = lazy(() => import('@/modules/job/pages/JobSearchPage').then(m => ({ default: m.JobSearchPage })));
const AdminSystemHistory = lazy(() => import('@/modules/admin/pages/AdminSystemHistory').then(m => ({ default: m.AdminSystemHistory })));
const AdminFeedbackPage = lazy(() => import('@/modules/admin/pages/AdminFeedbackPage').then(m => ({ default: m.AdminFeedbackPage })));
const AdminPremiumRequests = lazy(() => import('@/modules/admin/pages/AdminPremiumRequests').then(m => ({ default: m.AdminPremiumRequests })));

const GuardLoader = ({ message }: { message: string }) => (
  <div className="h-screen w-full flex flex-col items-center justify-center bg-[#f4f7f6] gap-4 text-center">
    <Loader2 className="w-12 h-12 text-[#00b14f] animate-spin" />
    <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-[10px]">
      {message}
    </p>
  </div>
);

const PageLoader = () => <GuardLoader message="Đang tải trang..." />;

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
      return <Navigate to="/admin/dashboard" replace />;
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
  const { isLoading } = useUser();
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <Suspense fallback={<PageLoader />}><HomePage /></Suspense>;
  if (isLoading) return <GuardLoader message="Đang tải dữ liệu hệ thống..." />;

  // Admin/Employer vẫn cho xem trang chủ thay vì đá vào Dashboard
  return <Suspense fallback={<PageLoader />}><HomePage /></Suspense>;
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
      if (user.companyStatus === 'PENDING') return <Suspense fallback={<PageLoader />}><PendingApprovalPage /></Suspense>;
      if (user.companyStatus === 'REJECTED') return <Suspense fallback={<PageLoader />}><RejectedPage /></Suspense>;
      if (user.companyStatus === 'BLACKLIST') return <Suspense fallback={<PageLoader />}><BlacklistPage /></Suspense>;
      return <>{children}</>;
    }
    if (user.pendingJoinRequest) return <Suspense fallback={<PageLoader />}><JoinPendingPage /></Suspense>;
    return <Suspense fallback={<PageLoader />}><EmployerSetupPage /></Suspense>;
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
    errorElement: <RouterErrorElement />,
    children: [
      { path: '', element: <RootRedirect /> },
      { path: 'jobs', element: <Suspense fallback={<PageLoader />}><JobSearchPage /></Suspense> },
      { path: 'jobs/:id', element: <Suspense fallback={<PageLoader />}><JobDetailPage /></Suspense> },
      { path: 'companies', element: <Suspense fallback={<PageLoader />}><CompaniesPage /></Suspense> },
      { path: 'companies/:id', element: <Suspense fallback={<PageLoader />}><CompanyDetailPage /></Suspense> },
      {
        path: 'profile',
        element: (
          <ProtectedRoute
            allowedRoles={[Role.CANDIDATE]}
          >
            <Suspense fallback={<PageLoader />}><ProfilePage /></Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'resumes',
        element: (
          <ProtectedRoute allowedRoles={[Role.CANDIDATE]}>
            <Suspense fallback={<PageLoader />}><MyResumesPage /></Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'my-applications',
        element: (
          <ProtectedRoute allowedRoles={[Role.CANDIDATE]}>
            <Suspense fallback={<PageLoader />}><MyApplicationsPage /></Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'interviews',
        element: (
          <ProtectedRoute allowedRoles={[Role.CANDIDATE]}>
            <Suspense fallback={<PageLoader />}><MyInterviewsPage /></Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'saved-jobs',
        element: (
          <ProtectedRoute allowedRoles={[Role.CANDIDATE]}>
            <Suspense fallback={<PageLoader />}><SavedJobsPage /></Suspense>
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
    errorElement: <RouterErrorElement />,
    children: [
      { path: 'dashboard', element: <Suspense fallback={<PageLoader />}><EmployerDashboard /></Suspense> },
      { path: 'analytics', element: <Suspense fallback={<PageLoader />}><AnalyticsDashboard /></Suspense> },
      { path: 'company', element: <Suspense fallback={<PageLoader />}><CompanyProfilePage /></Suspense> },
      { path: 'profile', element: <Suspense fallback={<PageLoader />}><ProfilePage /></Suspense> },
      { path: 'jobs', element: <Suspense fallback={<PageLoader />}><EmployerManageJobs /></Suspense> },
      { path: 'jobs/create', element: <Suspense fallback={<PageLoader />}><ManageJobsPage /></Suspense> },
      {
        path: 'members',
        element: (
          <OwnerRoute>
            <Suspense fallback={<PageLoader />}><ManageMembers /></Suspense>
          </OwnerRoute>
        ),
      },
      {
        path: 'candidates',
        element: <Suspense fallback={<PageLoader />}><EmployerCandidatesPage /></Suspense>,
      },
      {
        path: 'candidates/:id',
        element: <Suspense fallback={<PageLoader />}><CandidateDetailPage /></Suspense>,
      },
      {
        path: 'interviews',
        element: <Suspense fallback={<PageLoader />}><EmployerInterviewsPage /></Suspense>,
      },
      {
        path: 'saved-candidates',
        element: <Suspense fallback={<PageLoader />}><SavedCandidatesPage /></Suspense>,
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
    errorElement: <RouterErrorElement />,
    children: [
      { path: 'dashboard', element: <Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense> },
      { path: 'companies', element: <Suspense fallback={<PageLoader />}><AdminVerifyCompany /></Suspense> },
      { path: 'jobs', element: <Suspense fallback={<PageLoader />}><AdminVerifyJobs /></Suspense> },
      { path: 'profile', element: <Suspense fallback={<PageLoader />}><ProfilePage /></Suspense> },
      { path: 'users', element: <Suspense fallback={<PageLoader />}><AdminUserList /></Suspense> },
      { path: 'job-categories', element: <Suspense fallback={<PageLoader />}><AdminJobCategory /></Suspense> },
      { path: 'system-history', element: <Suspense fallback={<PageLoader />}><AdminSystemHistory   /></Suspense> },
      { path: 'feedback', element: <Suspense fallback={<PageLoader />}><AdminFeedbackPage /></Suspense> },
      { path: 'premium-requests', element: <Suspense fallback={<PageLoader />}><AdminPremiumRequests /></Suspense> },
    ],
  },
  {
    path: '/login',
    errorElement: <RouterErrorElement />,
    element: (
      <AuthedRedirect>
        <Suspense fallback={<PageLoader />}><LoginPage /></Suspense>
      </AuthedRedirect>
    ),
  },
  {
    path: '/register',
    errorElement: <RouterErrorElement />,
    element: (
      <AuthedRedirect>
        <Suspense fallback={<PageLoader />}><RegisterPage /></Suspense>
      </AuthedRedirect>
    ),
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
