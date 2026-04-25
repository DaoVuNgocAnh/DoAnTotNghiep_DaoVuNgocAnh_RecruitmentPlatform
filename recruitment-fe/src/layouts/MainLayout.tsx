import { Outlet } from 'react-router-dom';
import { Header } from './common/Header'; 
import { Footer } from './common/Footer';
import { AppBreadcrumb } from '@/components/shared/AppBreadcrumb';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <AppBreadcrumb />
        </div>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}