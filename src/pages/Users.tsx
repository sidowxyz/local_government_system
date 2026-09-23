import { useMemo, useState } from 'react';
import { SearchIcon, PlusIcon } from '../components/icons';
import { SelectFilter } from '../components/SelectFilter';
import { EmptyState } from '../components/EmptyState';
import { SortHeader, type SortDirection } from '../components/SortHeader';
import { Button } from '../components/Button';
import { CreateUserModal } from '../components/CreateUserModal';
import { UserScopeModal } from '../components/UserScopeModal';
import { adminUsers as initialUsers, allUserRoles, type AdminUser, type ScopeAccess } from '../data/users';

type SortKey = 'name' | 'phone' | 'status' | 'lastSignedInSortKey';

const headerClasses =
  'px-5 py-3 text-meta font-medium uppercase tracking-[0.06em] text-muted';

function compare(a: AdminUser, b: AdminUser, key: SortKey): number {
  if (key === 'lastSignedInSortKey') return a.lastSignedInSortKey - b.lastSignedInSortKey;
  return String(a[key]).localeCompare(String(b[key]));
}

function UserStatusBadge({ status }: { status: AdminUser['status'] }) {
  const styles =
    status === 'Active'
      ? 'bg-emerald-50 text-success ring-emerald-200'
      : 'bg-surface text-muted ring-hairline';

  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-meta font-medium ring-1',
        styles,
      ].join(' ')}
    >
      {status}
    </span>
  );
}

export function Users() {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isScopeModalOpen, setIsScopeModalOpen] = useState(false);
  const [scopeUser, setScopeUser] = useState<AdminUser | null>(null);
  const [term, setTerm] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('lastSignedInSortKey');
  const [direction, setDirection] = useState<SortDirection>('desc');

  const rows = useMemo(() => {
    const needle = term.trim().toLowerCase();
    const filtered = users.filter((u) => {
      const matchesStatus = status === '' || u.status === status;
      const matchesRole =
        role === '' || u.roles.some((r) => r.toLowerCase() === role.toLowerCase());
      const matchesTerm =
        needle === '' ||
        u.name.toLowerCase().includes(needle) ||
        u.phone.includes(needle);
      return matchesStatus && matchesRole && matchesTerm;
    });
    return [...filtered].sort((a, b) =>
      direction === 'asc' ? compare(a, b, sortKey) : compare(b, a, sortKey)
    );
  }, [users, term, role, status, sortKey, direction]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setDirection(key === 'lastSignedInSortKey' ? 'desc' : 'asc');
  };

  const handleSaveUser = (savedUser: AdminUser) => {
    if (editingUser) {
      setUsers((current) =>
        current.map((u) => (u.id === savedUser.id ? savedUser : u))
      );
    } else {
      setUsers((current) => [savedUser, ...current]);
    }
  };

  const handleOpenCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: AdminUser) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleOpenScope = (user: AdminUser) => {
    setScopeUser(user);
    setIsScopeModalOpen(true);
  };

  const handleSaveScopes = (userId: string, scopes: Record<string, ScopeAccess>) => {
    setUsers((current) =>
      current.map((u) => (u.id === userId ? { ...u, scopes } : u))
    );
  };

  return (
    <section
      aria-labelledby="users-heading"
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex max-h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-hairline bg-white shadow-card">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-hairline bg-white px-4 py-4 sm:px-6 sm:py-5">
          <h1 id="users-heading" className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
            Users
          </h1>
          <Button
            onClick={handleOpenCreate}
            className="shadow-sm transition-all duration-150 hover:shadow"
          >
            <PlusIcon className="h-4 w-4" strokeWidth={1.75} />
            <span>Create</span>
          </Button>
        </div>

        {/* Filters bar */}
        <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-hairline px-5 py-3">
          <div className="relative w-full sm:w-72">
            <label htmlFor="user-search" className="sr-only">
              Search users
            </label>
            <SearchIcon
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              strokeWidth={1.75}
            />
            <input
              id="user-search"
              type="search"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Search by name or phone"
              className="w-full rounded-lg border border-hairline bg-white py-2.5 pl-9 pr-3 text-body text-ink placeholder:text-muted/70 shadow-card transition-all duration-150 ease-standard focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <SelectFilter
            id="filter-role"
            label="Role"
            placeholder="All roles"
            value={role}
            onChange={setRole}
            options={allUserRoles.map((r) => ({ value: r, label: r }))}
          />

          <SelectFilter
            id="filter-status"
            label="Status"
            placeholder="All statuses"
            value={status}
            onChange={setStatus}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
            ]}
          />

          <div className="ml-auto flex items-center gap-3">
            {(term !== '' || role !== '' || status !== '') && (
              <button
                type="button"
                onClick={() => {
                  setTerm('');
                  setRole('');
                  setStatus('');
                }}
                className="rounded-md text-body text-muted transition-colors duration-150 ease-standard hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Reset
              </button>
            )}
            <span className="text-meta text-muted">
              {rows.length} {rows.length === 1 ? 'user' : 'users'}
            </span>
          </div>
        </div>

        {/* Users Table */}
        {rows.length === 0 ? (
          <EmptyState
            title="No users found"
            description="Try changing the search query or reset the filters."
          />
        ) : (
          <>
            <div className="min-h-0 overflow-auto">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">
                  Administration users list
                </caption>
                <thead className="sticky top-0 z-10 border-b border-hairline bg-surface/60 backdrop-blur-sm">
                  <tr className="border-b border-hairline">
                    <th scope="col" className={`${headerClasses} w-[220px]`}>
                      <SortHeader
                        label="Name"
                        active={sortKey === 'name'}
                        direction={direction}
                        onClick={() => toggleSort('name')}
                      />
                    </th>
                    <th scope="col" className={`${headerClasses} w-[150px]`}>
                      <SortHeader
                        label="Phone"
                        active={sortKey === 'phone'}
                        direction={direction}
                        onClick={() => toggleSort('phone')}
                      />
                    </th>
                    <th scope="col" className={headerClasses}>
                      Roles & access
                    </th>
                    <th scope="col" className={`${headerClasses} w-[110px]`}>
                      <SortHeader
                        label="Status"
                        active={sortKey === 'status'}
                        direction={direction}
                        onClick={() => toggleSort('status')}
                      />
                    </th>
                    <th scope="col" className={`${headerClasses} w-[180px]`}>
                      <SortHeader
                        label="Last signed in"
                        active={sortKey === 'lastSignedInSortKey'}
                        direction={direction}
                        onClick={() => toggleSort('lastSignedInSortKey')}
                      />
                    </th>
                    <th
                      scope="col"
                      className={`${headerClasses} w-[130px] text-right`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {rows.map((user) => (
                    <tr
                      key={user.id}
                      className="transition-colors duration-150 ease-standard hover:bg-surface"
                    >
                      <td className="px-5 py-3.5 text-body font-semibold text-ink">
                        {user.name}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 font-mono text-meta text-primary/80">
                        {user.phone}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap items-center gap-1.5 py-0.5">
                          {user.roles.map((r, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center rounded-md border border-hairline bg-surface/80 px-2 py-0.5 text-[11px] font-medium text-ink"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <UserStatusBadge status={user.status} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-meta text-muted">
                        {user.lastSignedIn}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-right text-meta">
                        <div className="inline-flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(user)}
                            className="font-medium text-primary transition-colors duration-150 hover:text-primary-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenScope(user)}
                            className="font-medium text-muted transition-colors duration-150 hover:text-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            Scope
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="shrink-0 border-t border-hairline px-5 py-3 text-right text-meta text-muted">
              Showing 1–{rows.length} of {rows.length}
            </div>
          </>
        )}
      </div>

      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        userToEdit={editingUser}
      />

      <UserScopeModal
        isOpen={isScopeModalOpen}
        onClose={() => {
          setIsScopeModalOpen(false);
          setScopeUser(null);
        }}
        user={scopeUser}
        onSaveScopes={handleSaveScopes}
      />
    </section>
  );
}
