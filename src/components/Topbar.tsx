import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronDownIcon, SidebarSimpleIcon } from './icons';

interface TopbarProps {
  title: string;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobileSidebar: () => void;
}

const languages = ['SO', 'EN'] as const;
type Language = (typeof languages)[number];

export function Topbar({ title, sidebarCollapsed, onToggleSidebar, onOpenMobileSidebar }: TopbarProps) {
  const [language, setLanguage] = useState<Language>('SO');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="z-nav flex h-16 shrink-0 items-center justify-between gap-2 border-b border-hairline bg-white px-3 shadow-[0_1px_3px_rgba(15,30,54,0.02)] sm:gap-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => {
            onToggleSidebar();
            onOpenMobileSidebar();
          }}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <SidebarSimpleIcon className="h-5 w-5" weight="duotone" />
        </button>
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 text-meta">
          <span className="hidden text-muted sm:inline">Dashboard</span>
          {title !== 'Dashboard' ? (
            <>
              <span aria-hidden="true" className="hidden text-muted/50 sm:inline">/</span>
              <span className="truncate text-ink">{title}</span>
            </>
          ) : null}
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <div
          role="group"
          aria-label="Language"
          className="flex items-center gap-1 rounded-lg border border-hairline bg-surface p-1">
          
          {languages.map((code) => {
            const isActive = code === language;
            return (
              <button
                key={code}
                type="button"
                aria-pressed={isActive}
                onClick={() => setLanguage(code)}
                className={[
                'rounded-md px-2.5 py-1 text-meta font-semibold transition-all duration-150 ease-standard',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                isActive ?
                'bg-primary text-white shadow-sm' :
                'text-muted hover:text-ink'].
                join(' ')
                }>
                
                {code}
              </button>);

          })}
        </div>

        <div className="hidden h-5 w-px bg-hairline sm:block" />

        <div className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-3 rounded-lg border border-transparent p-1.5 text-left transition-all duration-150 ease-standard hover:border-hairline hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-meta font-bold text-white shadow-sm ring-2 ring-primary/20">
              {user?.avatar ?? 'BA'}
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-body font-semibold text-ink">
                {user?.name ?? 'Bashir Ahmed Mohamud'}
              </span>
              <span className="block font-mono text-[11px] text-muted">{user?.role ?? 'Officer'} — {user?.badge ?? 'R001'}</span>
            </span>
            <ChevronDownIcon className={`h-4 w-4 text-muted transition-transform duration-150 ${userMenuOpen ? 'rotate-180' : ''}`} strokeWidth={1.75} />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-hairline bg-white p-1.5 shadow-cardHover">
              <div className="border-b border-hairline px-3 py-2 text-meta">
                <p className="font-semibold text-ink">{user?.name}</p>
                <p className="text-muted text-[11px] truncate">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(false);
                  logout();
                  navigate('/login');
                }}
                className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-body font-medium text-danger transition-colors hover:bg-danger/10">
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>);

}