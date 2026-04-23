import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center py-12 px-4">
      <div className="mb-8">
        <Link to="/" className="text-4xl font-bold text-green-600">SmartCV</Link>
      </div>
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}