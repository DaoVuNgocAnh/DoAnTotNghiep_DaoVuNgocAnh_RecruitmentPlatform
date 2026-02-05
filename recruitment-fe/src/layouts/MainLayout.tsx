import { Outlet, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="text-2xl font-bold text-green-600">SmartCV</Link>
          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/jobs" className="text-sm font-medium hover:text-green-600">Tìm việc làm</Link>
            <Link to="/companies" className="text-sm font-medium hover:text-green-600">Công ty</Link>
            <Button variant="outline" asChild><Link to="/login">Đăng nhập</Link></Button>
            <Button className="bg-green-600 hover:bg-green-700">Đăng tuyển</Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t bg-white py-10">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2026 SmartCV. Hệ thống quản lý tuyển dụng thông minh.</p>
        </div>
      </footer>
    </div>
  );
}