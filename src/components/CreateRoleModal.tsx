import { useState, useEffect } from 'react';
import { XIcon } from './icons';
import { Button } from './Button';
import {
  featureKeys,
  serviceDefinitions,
  reportItems,
  type Role,
} from '../data/roles';

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (role: Role) => void;
}

export function CreateRoleModal({
  isOpen,
  onClose,
  onSave,
}: CreateRoleModalProps) {
  const [code, setCode] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameSo, setNameSo] = useState('');
  const [errors, setErrors] = useState<{ code?: string; nameEn?: string; nameSo?: string }>({});

  useEffect(() => {
    if (isOpen) {
      setCode('');
      setNameEn('');
      setNameSo('');
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNameEnChange = (val: string) => {
    setNameEn(val);
    if (!code || code === nameEn.trim().toUpperCase().replace(/[^A-Z0-9]/g, '_')) {
      setCode(val.trim().toUpperCase().replace(/[^A-Z0-9]/g, '_'));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { code?: string; nameEn?: string; nameSo?: string } = {};

    if (!code.trim()) {
      newErrors.code = 'Code is required';
    }
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

    const initialFeatures: Record<string, string[]> = {};
    const initialServices: Record<string, string[]> = {};
    featureKeys.forEach((f) => {
      initialFeatures[f.key] = ['view'];
    });
    serviceDefinitions.forEach((s) => {
      initialServices[s.code] = ['view'];
    });

    const newRole: Role = {
      id: `role-${Date.now()}`,
      name: nameEn.trim(),
      nameSomali: nameSo.trim(),
      code: code.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_'),
      status: 'Active',
      userCount: 0,
      featurePermissions: initialFeatures,
      servicePermissions: initialServices,
      reportScope: 'all',
      allowedReports: reportItems.map((r) => r.id),
    };

    onSave(newRole);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-role-title"
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
          <h2 id="create-role-title" className="text-display font-semibold text-ink">
            New role
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
        <form onSubmit={handleSave} className="max-h-[calc(90vh-88px)] overflow-y-auto space-y-4 px-6 py-5">
          {/* Code */}
          <div>
            <label htmlFor="create-role-code" className="text-meta font-medium text-ink">
              Code <span className="text-rose-500">*</span>
            </label>
            <input
              id="create-role-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_'))}
              placeholder="e.g. BIZ_REG_OFFICER"
              className={`mt-1.5 w-full font-mono rounded-lg border bg-white px-3.5 py-2 text-body text-ink placeholder:text-muted/50 shadow-sm uppercase transition-colors duration-150 focus:outline-none focus:ring-2 ${
                errors.code
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                  : 'border-hairline focus:border-primary focus:ring-primary/20'
              }`}
            />
            <p className="mt-1 text-meta text-muted">
              UPPER_SNAKE_CASE. Set once — other records point at it and it cannot be changed later.
            </p>
            {errors.code && (
              <p className="mt-1 text-meta text-rose-600">{errors.code}</p>
            )}
          </div>

          {/* Name (English) */}
          <div>
            <label htmlFor="create-role-name-en" className="text-meta font-medium text-ink">
              Name (English) <span className="text-rose-500">*</span>
            </label>
            <input
              id="create-role-name-en"
              type="text"
              value={nameEn}
              onChange={(e) => handleNameEnChange(e.target.value)}
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
            <label htmlFor="create-role-name-so" className="text-meta font-medium text-ink">
              Name (Somali) <span className="text-rose-500">*</span>
            </label>
            <input
              id="create-role-name-so"
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
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
