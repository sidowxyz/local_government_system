import { useState, useEffect } from 'react';
import { XIcon, InfoIcon } from './icons';
import { Button } from './Button';
import { Listbox } from './Listbox';
import { Checkbox } from './Checkbox';
import type { AdminUser } from '../data/users';

const availableRoles = [
  'Approval',
  'business registerer',
  'Civil Registery',
  'Appove Civil Registry',
  'Finance',
  'Issue Civil Regsitry',
  'Vehicle Register',
  'Civil Registry Payment',
  'Rgisterer',
  'Business Licence Registerer',
  'Vehicle Approver',
  'Vehicle Money Collector',
];

const availableOffices = [
  { value: 'hodan', label: 'Hodan Office' },
  { value: 'waaberi', label: 'Waaberi Office' },
  { value: 'wadajir', label: 'Wadajir Office' },
  { value: 'hamar_weyne', label: 'Hamar Weyne Office' },
  { value: 'shibis', label: 'Shibis Office' },
];

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: AdminUser) => void;
  userToEdit?: AdminUser | null;
}

export function CreateUserModal({
  isOpen,
  onClose,
  onSave,
  userToEdit,
}: CreateUserModalProps) {
  const isEditing = Boolean(userToEdit);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [office, setOffice] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      if (userToEdit) {
        setName(userToEdit.name);
        setPhone(userToEdit.phone);
        setPassword('');
        setOffice('hodan');
        setStatus(userToEdit.status);
        setSelectedRoles(userToEdit.roles.filter((r) => r !== 'None'));
      } else {
        setName('');
        setPhone('+252');
        setPassword('ChangeMe123!');
        setOffice('');
        setStatus('Active');
        setSelectedRoles([]);
      }
      setErrors({});
    }
  }, [isOpen, userToEdit]);

  if (!isOpen) return null;

  const toggleRole = (role: string) => {
    setSelectedRoles((current) =>
      current.includes(role)
        ? current.filter((r) => r !== role)
        : [...current, role]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!phone.trim() || phone === '+252') newErrors.phone = 'Phone number is required';
    if (!isEditing && !password.trim()) newErrors.password = 'Initial password is required';
    if (!isEditing && !office) newErrors.office = 'Please select an office';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })}, ${now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })}`;

    const savedUser: AdminUser = {
      id: userToEdit ? userToEdit.id : `usr-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      roles: selectedRoles.length > 0 ? selectedRoles : ['None'],
      status: status,
      lastSignedIn: userToEdit ? userToEdit.lastSignedIn : formattedDate,
      lastSignedInSortKey: userToEdit ? userToEdit.lastSignedInSortKey : Date.now(),
    };

    onSave(savedUser);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
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
            <h2 id="modal-title" className="text-display font-bold tracking-tight text-ink">
              {isEditing ? 'Edit user' : 'New user'}
            </h2>
            <p className="mt-1 text-body text-muted">
              {isEditing
                ? 'Update account details and role permissions.'
                : 'Create the account, then set what they may see.'}
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="space-y-6 px-6 py-6">
            {/* 2 by 2 Input Grid */}
            <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label
                  htmlFor="user-name"
                  className="block text-body font-semibold text-ink"
                >
                  Name <span className="text-danger">*</span>
                </label>
                <input
                  id="user-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  placeholder="Full name"
                  className={`mt-2 w-full rounded-lg border bg-white px-3.5 py-2.5 text-body text-ink placeholder:text-muted/60 shadow-card transition-all focus:outline-none focus:ring-2 ${
                    errors.name
                      ? 'border-danger focus:border-danger focus:ring-danger/20'
                      : 'border-hairline focus:border-primary focus:ring-primary/20'
                  }`}
                />
                {errors.name ? (
                  <p className="mt-1.5 text-meta text-danger">{errors.name}</p>
                ) : null}
              </div>

              {/* Phone */}
              <div>
                <div className="flex items-center gap-1.5">
                  <label
                    htmlFor="user-phone"
                    className="block text-body font-semibold text-ink"
                  >
                    Phone <span className="text-danger">*</span>
                  </label>
                  <div className="group relative inline-flex items-center">
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label="Phone explanation"
                      className="cursor-help text-muted/60 transition-colors hover:text-ink focus:outline-none"
                    >
                      <InfoIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </button>
                    <div className="pointer-events-none absolute left-0 top-full z-50 mt-2 hidden w-64 rounded-lg border border-hairline bg-ink p-2.5 text-xs leading-relaxed text-white shadow-2xl group-hover:block group-focus-within:block">
                      <div className="absolute -top-1.5 left-3.5 h-3 w-3 rotate-45 border-l border-t border-hairline bg-ink" />
                      <span className="relative z-10">This is how they sign in.</span>
                    </div>
                  </div>
                </div>
                <input
                  id="user-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                  }}
                  placeholder="+252..."
                  className={`mt-2 w-full rounded-lg border bg-white px-3.5 py-2.5 font-mono text-body text-ink placeholder:text-muted/60 shadow-card transition-all focus:outline-none focus:ring-2 ${
                    errors.phone
                      ? 'border-danger focus:border-danger focus:ring-danger/20'
                      : 'border-hairline focus:border-primary focus:ring-primary/20'
                  }`}
                />
                {errors.phone ? (
                  <p className="mt-1.5 text-meta text-danger">{errors.phone}</p>
                ) : null}
              </div>

              {/* Initial Password (or Reset Password if editing) */}
              <div>
                <div className="flex items-center gap-1.5">
                  <label
                    htmlFor="user-password"
                    className="block text-body font-semibold text-ink"
                  >
                    {isEditing ? 'New password (optional)' : 'Initial password'}{' '}
                    {!isEditing && <span className="text-danger">*</span>}
                  </label>
                  <div className="group relative inline-flex items-center">
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label="Initial password explanation"
                      className="cursor-help text-muted/60 transition-colors hover:text-ink focus:outline-none"
                    >
                      <InfoIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </button>
                    <div className="pointer-events-none absolute left-0 top-full z-50 mt-2 hidden w-72 rounded-lg border border-hairline bg-ink p-2.5 text-xs leading-relaxed text-white shadow-2xl group-hover:block group-focus-within:block">
                      <div className="absolute -top-1.5 left-3.5 h-3 w-3 rotate-45 border-l border-t border-hairline bg-ink" />
                      <span className="relative z-10">
                        {isEditing
                          ? 'Leave blank to keep existing password unchanged.'
                          : 'Read this out to them. They must change it when they first sign in.'}
                      </span>
                    </div>
                  </div>
                </div>
                <input
                  id="user-password"
                  type="text"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  placeholder={isEditing ? 'Leave blank to keep existing' : 'Initial password'}
                  className={`mt-2 w-full rounded-lg border bg-white px-3.5 py-2.5 font-mono text-body text-ink placeholder:text-muted/60 shadow-card transition-all focus:outline-none focus:ring-2 ${
                    errors.password
                      ? 'border-danger focus:border-danger focus:ring-danger/20'
                      : 'border-hairline focus:border-primary focus:ring-primary/20'
                  }`}
                />
                {errors.password ? (
                  <p className="mt-1.5 text-meta text-danger">{errors.password}</p>
                ) : null}
              </div>

              {/* Office or Status */}
              <div>
                <div className="flex items-center gap-1.5">
                  <label
                    htmlFor="user-office"
                    className="block text-body font-semibold text-ink"
                  >
                    Office {!isEditing && <span className="text-danger">*</span>}
                  </label>
                  <div className="group relative inline-flex items-center">
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label="Office explanation"
                      className="cursor-help text-muted/60 transition-colors hover:text-ink focus:outline-none"
                    >
                      <InfoIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </button>
                    <div className="pointer-events-none absolute left-0 top-full z-50 mt-2 hidden w-72 rounded-lg border border-hairline bg-ink p-2.5 text-xs leading-relaxed text-white shadow-2xl group-hover:block group-focus-within:block">
                      <div className="absolute -top-1.5 left-3.5 h-3 w-3 rotate-45 border-l border-t border-hairline bg-ink" />
                      <span className="relative z-10">
                        Where they work. It decides which office's records their work belongs to.
                      </span>
                    </div>
                  </div>
                </div>
                <Listbox
                  id="user-office"
                  value={office}
                  options={availableOffices}
                  placeholder="Select…"
                  onChange={(val) => {
                    setOffice(val);
                    if (errors.office) setErrors((prev) => ({ ...prev, office: '' }));
                  }}
                  className={`mt-2 ${errors.office ? 'ring-2 ring-danger/30 rounded-lg' : ''}`}
                />
                {errors.office ? (
                  <p className="mt-1.5 text-meta text-danger">{errors.office}</p>
                ) : null}
              </div>
            </div>

            {/* Status if editing */}
            {isEditing && (
              <div>
                <label
                  htmlFor="user-status"
                  className="block text-body font-semibold text-ink"
                >
                  Account status
                </label>
                <div className="mt-2 flex items-center gap-4">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="Active"
                      checked={status === 'Active'}
                      onChange={() => setStatus('Active')}
                      className="h-4 w-4 border-hairline text-primary focus:ring-primary/20"
                    />
                    <span className="text-body font-medium text-ink">Active</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="Inactive"
                      checked={status === 'Inactive'}
                      onChange={() => setStatus('Inactive')}
                      className="h-4 w-4 border-hairline text-primary focus:ring-primary/20"
                    />
                    <span className="text-body font-medium text-ink">Inactive</span>
                  </label>
                </div>
              </div>
            )}

            {/* Roles & Access */}
            <div>
              <div className="flex items-center gap-1.5">
                <div className="block text-body font-semibold text-ink">
                  Roles & access
                </div>
                <div className="group relative inline-flex items-center">
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-label="Roles explanation"
                    className="cursor-help text-muted/60 transition-colors hover:text-ink focus:outline-none"
                  >
                    <InfoIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </button>
                  <div className="pointer-events-none absolute left-0 top-full z-50 mt-2 hidden w-72 rounded-lg border border-hairline bg-ink p-2.5 text-xs leading-relaxed text-white shadow-2xl group-hover:block group-focus-within:block">
                    <div className="absolute -top-1.5 left-3.5 h-3 w-3 rotate-45 border-l border-t border-hairline bg-ink" />
                    <span className="relative z-10">
                      What they may do. Which records they may act on is set next.
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {availableRoles.map((role) => {
                  const isChecked = selectedRoles.includes(role);
                  return (
                    <label
                      key={role}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
                        isChecked
                          ? 'border-primary bg-primary/5 text-ink shadow-sm'
                          : 'border-hairline bg-surface/40 text-muted hover:border-hairline hover:bg-surface hover:text-ink'
                      }`}
                    >
                      <Checkbox
                        checked={isChecked}
                        onChange={() => toggleRole(role)}
                      />
                      <span className="text-body font-medium">{role}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-auto flex items-center justify-end gap-3 border-t border-hairline bg-surface/50 px-6 py-4">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Save changes' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
