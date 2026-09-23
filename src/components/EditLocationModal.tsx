import { useState, useEffect } from 'react';
import { XIcon } from './icons';
import { Button } from './Button';
import { Listbox } from './Listbox';
import type { LocationItem, LocationType } from '../data/organisation';

interface EditLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: LocationItem | null;
  onSave: (updated: LocationItem) => void;
}

export function EditLocationModal({
  isOpen,
  onClose,
  location,
  onSave,
}: EditLocationModalProps) {
  const [nameEn, setNameEn] = useState('');
  const [nameSo, setNameSo] = useState('');
  const [type, setType] = useState<LocationType>('DISTRICT');
  const [errors, setErrors] = useState<{ nameEn?: string; nameSo?: string }>({});

  useEffect(() => {
    if (location && isOpen) {
      setNameEn(location.name);
      setNameSo(location.nameSomali || location.name);
      setType(location.type);
      setErrors({});
    }
  }, [location, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !location) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { nameEn?: string; nameSo?: string } = {};

    if (!nameEn.trim()) newErrors.nameEn = 'Name (English) is required';
    if (!nameSo.trim()) newErrors.nameSo = 'Magaca (Soomaali) is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...location,
      name: nameEn.trim(),
      nameSomali: nameSo.trim(),
      type,
    });
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
      aria-labelledby="edit-loc-title"
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
        <div className="flex items-center justify-between border-b border-hairline px-6 py-5">
          <div>
            <h2 id="edit-loc-title" className="text-display font-semibold text-ink">
              {location.code}
            </h2>
            <p className="mt-0.5 text-meta text-muted">
              The code cannot be changed once records reference it.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-muted transition-colors duration-150 hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <XIcon className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 px-6 py-5">
          <div>
            <label className="text-meta font-medium text-ink">Code</label>
            <input
              type="text"
              value={location.code}
              disabled
              className="mt-1.5 w-full font-mono rounded-lg border border-hairline bg-surface/80 px-3.5 py-2 text-body text-ink cursor-not-allowed uppercase"
            />
          </div>

          <div>
            <label htmlFor="edit-loc-name-en" className="text-meta font-medium text-ink">
              Name (English) <span className="text-rose-500">*</span>
            </label>
            <input
              id="edit-loc-name-en"
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className={`mt-1.5 ${inputBase} ${errors.nameEn ? inputErr : inputOk}`}
            />
            {errors.nameEn && (
              <p className="mt-1 text-meta text-rose-600">{errors.nameEn}</p>
            )}
          </div>

          <div>
            <label htmlFor="edit-loc-name-so" className="text-meta font-medium text-ink">
              Magaca (Soomaali) <span className="text-rose-500">*</span>
            </label>
            <input
              id="edit-loc-name-so"
              type="text"
              value={nameSo}
              onChange={(e) => setNameSo(e.target.value)}
              className={`mt-1.5 ${inputBase} ${errors.nameSo ? inputErr : inputOk}`}
            />
            {errors.nameSo && (
              <p className="mt-1 text-meta text-rose-600">{errors.nameSo}</p>
            )}
          </div>

          <div>
            <label htmlFor="edit-loc-type" className="text-meta font-medium text-ink">
              Level <span className="text-rose-500">*</span>
            </label>
            <Listbox
              id="edit-loc-type"
              value={type}
              onChange={(value) => setType(value as LocationType)}
              options={['DISTRICT', 'SUB_DISTRICT', 'SECTION', 'ZONE'].map((value) => ({ value, label: value }))}
              className="mt-1.5"
            />
          </div>

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
