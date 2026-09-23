import { useState, useEffect } from 'react';
import { XIcon } from './icons';
import { Button } from './Button';
import type { Role } from '../data/roles';

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  onSave: (updatedRole: Role) => void;
}

export function EditRoleModal({
  isOpen,
  onClose,
  role,
  onSave,
}: EditRoleModalProps) {
  const [nameEn, setNameEn] = useState('');
  const [nameSo, setNameSo] = useState('');
  const [errors, setErrors] = useState<{ nameEn?: string; nameSo?: string }>({});

  useEffect(() => {
    if (role && isOpen) {
      setNameEn(role.name);
      setNameSo(role.nameSomali || '');
      setErrors({});
    }
  }, [role, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !role) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { nameEn?: string; nameSo?: string } = {};

    if (!nameEn.trim()) {
      newErrors.nameEn = 'Name (English) is required';
    }
    if (!nameSo.trim()) {
      newErrors.nameSo = 'Name (Somali) is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updated: Role = {
      ...role,
      name: nameEn.trim(),
      nameSomali: nameSo.trim(),
    };

    onSave(updated);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rename-role-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Full Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div
        className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-hairline bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
          <h2 id="rename-role-title" className="text-display font-semibold text-ink">
            Rename this role
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-muted transition-colors duration-150 hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <XIcon className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="space-y-4 px-6 py-5">
          {/* Code (Read-only) */}
          <div>
            <label htmlFor="edit-role-code" className="text-meta font-medium text-ink">
              Code
            </label>
            <input
              id="edit-role-code"
              type="text"
              value={role.code}
              disabled
              className="mt-1.5 w-full font-mono rounded-lg border border-hairline bg-surface/80 px-3.5 py-2 text-body text-ink cursor-not-allowed uppercase"
            />
            <p className="mt-1 text-meta text-muted">
              The code is stamped on every assignment and cannot be changed.
            </p>
          </div>

          {/* Name (English) */}
          <div>
            <label htmlFor="edit-role-name-en" className="text-meta font-medium text-ink">
              Name (English) <span className="text-rose-500">*</span>
            </label>
            <input
              id="edit-role-name-en"
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="e.g. Approval"
              className={`mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2 text-body text-ink placeholder:text-muted/50 shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 ${
                errors.nameEn
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                  : 'border-hairline focus:border-primary focus:ring-primary/20'
              }`}
            />
            {errors.nameEn && (
              <p className="mt-1 text-meta text-rose-600">{errors.nameEn}</p>
            )}
          </div>

          {/* Name (Somali) */}
          <div>
            <label htmlFor="edit-role-name-so" className="text-meta font-medium text-ink">
              Name (Somali) <span className="text-rose-500">*</span>
            </label>
            <input
              id="edit-role-name-so"
              type="text"
              value={nameSo}
              onChange={(e) => setNameSo(e.target.value)}
              placeholder="e.g. Aqbale"
              className={`mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2 text-body text-ink placeholder:text-muted/50 shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 ${
                errors.nameSo
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                  : 'border-hairline focus:border-primary focus:ring-primary/20'
              }`}
            />
            {errors.nameSo && (
              <p className="mt-1 text-meta text-rose-600">{errors.nameSo}</p>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-hairline pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
