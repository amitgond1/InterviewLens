import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-navy-950">
      <aside className="hidden md:flex w-60 shrink-0">
        <Sidebar />
      </aside>
      <main className="flex-1 min-w-0 pb-20 md:pb-0 overflow-x-hidden">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
