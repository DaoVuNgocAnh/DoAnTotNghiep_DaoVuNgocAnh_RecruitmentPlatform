import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useUser } from '@/modules/user/hooks/useUser';
import { Loader2 } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  allowedRoles?: ('CANDIDATE' | 'EMPLOYER' | 'ADMIN')[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { isAuthenticated, token } = useAuthStore();
  const { data: user, isLoading } = useUser();
  const location = useLocation();

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#f4f7f6] gap-4">
        <Loader2 className="w-10 h-10 text-[#00b14f] animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse text-[10px] uppercase tracking-[0.2em]">
          Xác thực quyền truy cập...
        </p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to="/"
        state={{ message: 'Không có quyền truy cập', type: 'error' }}
        replace
      />
    );
  }

  return <>{children}</>;
}
