import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './common/Header';
import { Footer } from './common/Footer';
import { AppBreadcrumb } from '@/components/shared/AppBreadcrumb';
import { FloatingActionMenu } from '@/components/shared/FloatingActionMenu';

export default function MainLayout() {
  const { pathname } = useLocation();
  const showBreadcrumb = pathname !== '/';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {showBreadcrumb && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <AppBreadcrumb />
          </div>
        )}
        <Outlet />
      </main>
      <FloatingActionMenu />
      <Footer />
    </div>
  );
}
