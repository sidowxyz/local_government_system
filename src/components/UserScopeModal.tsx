import { useState, useEffect } from 'react';
import { XIcon, InfoIcon } from './icons';
import { Button } from './Button';
import { Listbox } from './Listbox';
import {
  departmentList,
  defaultBashirScopes,
  type AdminUser,
  type ScopeAccess,
} from '../data/users';

interface UserScopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onSaveScopes: (userId: string, scopes: Record<string, ScopeAccess>) => void;
}

const scopeOptions = [
  { value: 'No access', label: 'No access' },
  { value: 'Own office', label: 'Own office' },
  { value: 'All offices', label: 'All offices' },
];

export function UserScopeModal({
  isOpen,
  onClose,
  user,
  onSaveScopes,
}: UserScopeModalProps) {
  const [scopes, setScopes] = useState<Record<string, ScopeAccess>>({});

  useEffect(() => {
    if (isOpen && user) {
      if (user.scopes) {
        setScopes({ ...user.scopes });
      } else if (user.name.toLowerCase().includes('bashir')) {
        setScopes({ ...defaultBashirScopes });
      } else {
        const initial: Record<string, ScopeAccess> = {};
        departmentList.forEach((dept) => {
          initial[dept] = 'No access';
        });
        setScopes(initial);
      }
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handleScopeChange = (dept: string, value: string) => {
    setScopes((prev) => ({
      ...prev,
      [dept]: value as ScopeAccess,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveScopes(user.id, scopes);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="scope-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-hairline bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-hairline px-6 py-5">
          <div>
            <h2
              id="scope-modal-title"
              className="text-display font-bold tracking-tight text-ink"
            >
              {user.name}
            </h2>
            <p className="mt-1 text-body text-muted">
              What this user may see, per department.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <XIcon className="h-5 w-5" strokeWidth={1.75} />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="divide-y divide-hairline px-6 py-2">
            {departmentList.map((dept) => {
              const currentAccess: ScopeAccess = scopes[dept] || 'No access';
              const isOwnOffice = currentAccess === 'Own office';

              return (
                <div key={dept} className="py-4 first:pt-3 last:pb-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-body font-semibold text-ink">{dept}</span>
                    <div className="w-full sm:w-52">
                      <Listbox
                        value={currentAccess}
                        options={scopeOptions}
                        onChange={(val) => handleScopeChange(dept, val)}
                        placeholder="Select…"
                      />
                    </div>
                  </div>

                  {isOwnOffice && (
                    <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-surface/80 p-2.5 text-meta text-muted">
                      <InfoIcon
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70"
                        strokeWidth={1.75}
                      />
                      <p className="leading-relaxed">
                        Only records belonging to the office on their own user record.
                        Follows them if they move office.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="mt-auto flex items-center justify-end gap-3 border-t border-hairline bg-surface/50 px-6 py-4">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
