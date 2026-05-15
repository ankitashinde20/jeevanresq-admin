import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Topbar } from './Topbar.jsx';

export function DashboardLayout() {
  return (
    <div className="min-h-screen text-slate-100">
      <Sidebar />
      <main className="lg:pl-72">
        <Topbar />
        <div className="px-4 pb-8 pt-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

