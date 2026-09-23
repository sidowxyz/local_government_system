import { useState, useEffect } from 'react';
import { XIcon } from './icons';
import { Button } from './Button';
import { Listbox } from './Listbox';
import {
  tariffCategories,
  type Tariff,
  type TariffCategory,
} from '../data/tariffs';

interface EditTariffModalProps {
  isOpen: boolean;
  onClose: () => void;
  tariff: Tariff | null;
  onSave: (updatedTariff: Tariff) => void;
}

export function EditTariffModal({
  isOpen,
  onClose,
  tariff,
  onSave,
}: EditTariffModalProps) {
  const [nameEn, setNameEn] = useState('');
  const [nameSo, setNameSo] = useState('');
  const [category, setCategory] = useState<TariffCategory>('Business Licensing');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ nameEn?: string; nameSo?: string }>({});

  useEffect(() => {
    if (tariff && isOpen) {
      setNameEn(tariff.name);
      setNameSo(tariff.nameSomali || '');
      setCategory(tariff.category || 'Business Licensing');
      setDescription(tariff.description || '');
      setErrors({});
    }
  }, [tariff, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !tariff) return null;

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

    const updated: Tariff = {
      ...tariff,
      name: nameEn.trim(),
      nameSomali: nameSo.trim(),
      category,
      description: description.trim(),
    };

    onSave(updated);
    onClose();
  };

  const inputBase =
    'w-full rounded-lg border bg-white px-3.5 py-2 text-body text-ink placeholder:text-muted/50 shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2';
  const inputOk = 'border-hairline focus:border-primary focus:ring-primary/20';
  const inputErr = 'border-rose-300 focus:border-rose-500 focus:ring-rose-200';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rename-tariff-title"
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
          <h2 id="rename-tariff-title" className="text-display font-semibold text-ink">
            Edit tariff details
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
            <label htmlFor="edit-tariff-code" className="text-meta font-medium text-ink">
              Tariff Code
            </label>
            <input
              id="edit-tariff-code"
              type="text"
              value={tariff.code}
              disabled
              className="mt-1.5 w-full font-mono rounded-lg border border-hairline bg-surface/80 px-3.5 py-2 text-body text-ink cursor-not-allowed uppercase"
            />
            <p className="mt-1 text-meta text-muted">
              The code is stamped on previous invoices and cannot be altered.
            </p>
          </div>

          {/* Name (English) */}
          <div>
            <label htmlFor="edit-tariff-name-en" className="text-meta font-medium text-ink">
              Name (English) <span className="text-rose-500">*</span>
            </label>
            <input
              id="edit-tariff-name-en"
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="e.g. Business registration fee"
              className={`mt-1.5 ${inputBase} ${
                errors.nameEn ? inputErr : inputOk
              }`}
            />
            {errors.nameEn && (
              <p className="mt-1 text-meta text-rose-600">{errors.nameEn}</p>
            )}
          </div>

          {/* Name (Somali) */}
          <div>
            <label htmlFor="edit-tariff-name-so" className="text-meta font-medium text-ink">
              Name (Somali) <span className="text-rose-500">*</span>
            </label>
            <input
              id="edit-tariff-name-so"
              type="text"
              value={nameSo}
              onChange={(e) => setNameSo(e.target.value)}
              placeholder="e.g. Lacagta diiwaangelinta"
              className={`mt-1.5 ${inputBase} ${
                errors.nameSo ? inputErr : inputOk
              }`}
            />
            {errors.nameSo && (
              <p className="mt-1 text-meta text-rose-600">{errors.nameSo}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="edit-tariff-category" className="text-meta font-medium text-ink">
              Department Category
            </label>
            <Listbox
              id="edit-tariff-category"
              value={category}
              onChange={(value) => setCategory(value as TariffCategory)}
              options={tariffCategories.map((cat) => ({ value: cat, label: cat }))}
              className="mt-1.5"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="edit-tariff-desc" className="text-meta font-medium text-ink">
              Description <span className="text-muted font-normal">optional</span>
            </label>
            <textarea
              id="edit-tariff-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`mt-1.5 ${inputBase} ${inputOk} resize-none`}
            />
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-hairline pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
