import { NavLink } from 'react-router-dom';
import logo from '../assets/Logo.svg';
import {
  InboxIcon,
  ClipboardTextIcon,
  NotePencilIcon,
  UsersIcon,
  UserIdIcon,
  BanknoteIcon,
  ReceiptIcon,
  Building2Icon,
  type IconComponent,
} from './icons';

interface NavItem {
  to: string;
  label: string;
  icon: IconComponent;
  exact?: boolean;
}

const workItems: NavItem[] = [
  { to: '/inbox', label: 'Dashboard', icon: InboxIcon },
  { to: '/applications', label: 'Applications', icon: ClipboardTextIcon, exact: true },
  { to: '/applications/new', label: 'New application', icon: NotePencilIcon },
];

const registryItems: NavItem[] = [
  { to: '/parties', label: 'Parties', icon: UsersIcon },
];

const moneyItems: NavItem[] = [
  { to: '/counter', label: 'Payment counter', icon: BanknoteIcon },
  { to: '/tariffs', label: 'Tariffs', icon: ReceiptIcon },
];

const adminItems: NavItem[] = [
  { to: '/users', label: 'Users', icon: UsersIcon },
  { to: '/roles', label: 'Roles & access', icon: UserIdIcon },
  { to: '/organisation', label: 'Organisation', icon: Building2Icon },
];

function NavGroup({
  title,
  items,
  collapsed,
  onNavigate,
}: {
  title: string;
  items: NavItem[];
  collapsed: boolean;
  onNavigate: () => void;
}) {
  return (
    <div>
      <p className={`${collapsed ? 'sr-only' : 'px-4 pb-2'} text-[11px] font-semibold uppercase tracking-[0.1em] text-muted/80`}>
        {title}
      </p>
      <ul className={`space-y-1 ${collapsed ? 'px-2' : 'px-3'}`}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.exact ?? false}
                onClick={onNavigate}
                className={({ isActive }) =>
                  [
                    `group flex items-center rounded-lg py-2.5 text-body transition-all duration-150 ease-standard ${collapsed ? 'justify-center px-2' : 'gap-3 px-3'}`,
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                    isActive
                      ? 'bg-primaryLight font-semibold text-primary shadow-[inset_0_0_0_1px_rgba(30,111,217,0.18)]'
                      : 'text-muted hover:bg-surface hover:text-ink',
                  ].join(' ')
                }
              >
                <Icon
                  className="h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-105"
                  strokeWidth={1.75}
                  weight="duotone"
                />
                <span className={collapsed ? 'sr-only' : 'truncate'}>{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Sidebar({
  collapsed,
  mobileOpen,
  onClose,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
    {mobileOpen && <button type="button" aria-label="Close navigation" onClick={onClose} className="fixed inset-0 z-40 bg-ink/25 lg:hidden" />}
    <aside className={`fixed inset-y-0 left-0 z-nav flex h-full shrink-0 flex-col border-r border-hairline bg-white shadow-[1px_0_4px_rgba(15,30,54,0.02)] transition-transform duration-200 ease-standard lg:static lg:translate-x-0 lg:shadow-[1px_0_4px_rgba(15,30,54,0.02)] ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} ${collapsed ? 'lg:w-16' : 'lg:w-sidebar'} w-[min(85vw,268px)]`}>
      <div className={`flex h-16 items-center border-b border-hairline ${collapsed ? 'justify-center px-2' : 'gap-3 px-4'}`}>
        <img src={logo} alt="Logo" className="h-9 w-9 shrink-0 object-contain" />
        <div className={`${collapsed ? 'hidden' : 'min-w-0 flex-1'}`}>
          <span className="block truncate text-body font-bold tracking-tight text-ink">
            Local Government
          </span>
          <span className="block truncate text-[11px] font-medium uppercase tracking-[0.06em] text-primary">
            Dashboard
          </span>
        </div>
      </div>

      <nav aria-label="Main" className="flex-1 space-y-6 overflow-y-auto py-5">
        <NavGroup title="Work" items={workItems} collapsed={collapsed} onNavigate={onClose} />
        <NavGroup title="Registry" items={registryItems} collapsed={collapsed} onNavigate={onClose} />
        <NavGroup title="Money" items={moneyItems} collapsed={collapsed} onNavigate={onClose} />
        <NavGroup title="Administration" items={adminItems} collapsed={collapsed} onNavigate={onClose} />
      </nav>

      <div className={`${collapsed ? 'hidden' : 'border-t border-hairline p-4'}`}>
        <div className="rounded-lg border border-hairline bg-surface/60 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
              Official Portal
            </span>
            <span className="font-mono text-[11px] text-muted">v0.1.0</span>
          </div>
          <dl className="space-y-1">
            <div className="flex items-baseline justify-between gap-2 text-meta">
              <dt className="text-muted">Currency</dt>
              <dd className="font-medium text-ink">USD ($)</dd>
            </div>
            <div className="flex items-baseline justify-between gap-2 text-meta">
              <dt className="text-muted">Timezone</dt>
              <dd className="font-medium text-ink">Mogadishu (EAT)</dd>
            </div>
          </dl>
        </div>
      </div>
    </aside>
    </>);

}