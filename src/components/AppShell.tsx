import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

const titles: { path: string; title: string }[] = [
  { path: '/applications/new', title: 'Applications' },
  { path: '/applications', title: 'Applications' },
  { path: '/inbox', title: 'Dashboard' },
  { path: '/parties/new', title: 'Parties' },
  { path: '/parties', title: 'Parties' },
  { path: '/counter', title: 'Payment counter' },
  { path: '/tariffs', title: 'Tariffs' },
  { path: '/users', title: 'Users' },
  { path: '/roles', title: 'Roles & access' },
];


export function AppShell() {
  const { pathname } = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const match = titles.find((entry) => pathname.startsWith(entry.path));

  return (
    <div className="flex h-full w-full bg-surface">
      <Sidebar collapsed={sidebarCollapsed} mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title={match ? match.title : 'Applications'}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((current) => !current)}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />
        <main className="min-h-0 flex-1 overflow-hidden">
          <div className="flex h-full w-full min-w-0 flex-col px-3 py-4 sm:px-5 sm:py-6 lg:px-[clamp(20px,2.5vw,40px)] lg:py-[clamp(20px,2vw,32px)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>);

}