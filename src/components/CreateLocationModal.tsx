import { useState, useEffect } from 'react';
import { XIcon } from './icons';
import { Button } from './Button';
import { Listbox } from './Listbox';
import type { LocationItem, LocationType } from '../data/organisation';

interface CreateLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (location: LocationItem) => void;
}

export function CreateLocationModal({
  isOpen,
  onClose,
  onSave,
}: CreateLocationModalProps) {
  const [code, setCode] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameSo, setNameSo] = useState('');
  const [type, setType] = useState<LocationType>('DISTRICT');
  const [errors, setErrors] = useState<{ code?: string; nameEn?: string }>({});

  useEffect(() => {
    if (isOpen) {
      setCode('');
      setNameEn('');
      setNameSo('');
      setType('DISTRICT');
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
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
    const newErrors: { code?: string; nameEn?: string } = {};

    if (!code.trim()) newErrors.code = 'Code is required';
    if (!nameEn.trim()) newErrors.nameEn = 'Name is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newLoc: LocationItem = {
      id: `loc-${Date.now()}`,
      code: code.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_'),
      name: nameEn.trim(),
      nameSomali: nameSo.trim() || undefined,
      type,
    };

    onSave(newLoc);
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
      aria-labelledby="create-location-title"
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
          <h2 id="create-location-title" className="text-display font-semibold text-ink">
            New location
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

        <form onSubmit={handleSave} className="space-y-4 px-6 py-5">
          <div>
            <label htmlFor="loc-code" className="text-meta font-medium text-ink">
              Code <span className="text-rose-500">*</span>
            </label>
            <input
              id="loc-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_'))}
              placeholder="e.g. H001"
              className={`mt-1.5 font-mono uppercase ${inputBase} ${
                errors.code ? inputErr : inputOk
              }`}
            />
            {errors.code && (
              <p className="mt-1 text-meta text-rose-600">{errors.code}</p>
            )}
          </div>

          <div>
            <label htmlFor="loc-name-en" className="text-meta font-medium text-ink">
              Name (English) <span className="text-rose-500">*</span>
            </label>
            <input
              id="loc-name-en"
              type="text"
              value={nameEn}
              onChange={(e) => handleNameEnChange(e.target.value)}
              placeholder="e.g. Hodan"
              className={`mt-1.5 ${inputBase} ${
                errors.nameEn ? inputErr : inputOk
              }`}
            />
            {errors.nameEn && (
              <p className="mt-1 text-meta text-rose-600">{errors.nameEn}</p>
            )}
          </div>

          <div>
            <label htmlFor="loc-name-so" className="text-meta font-medium text-ink">
              Name (Somali)
            </label>
            <input
              id="loc-name-so"
              type="text"
              value={nameSo}
              onChange={(e) => setNameSo(e.target.value)}
              placeholder="e.g. Hodan"
              className={`mt-1.5 ${inputBase} ${inputOk}`}
            />
          </div>

          <div>
            <label htmlFor="loc-type" className="text-meta font-medium text-ink">
              Location Type
            </label>
            <Listbox
              id="loc-type"
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
