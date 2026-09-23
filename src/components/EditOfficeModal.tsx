import { useState, useEffect } from 'react';
import { XIcon } from './icons';
import { Button } from './Button';
import { Listbox } from './Listbox';
import type { OfficeItem, DepartmentItem, LocationItem } from '../data/organisation';

interface EditOfficeModalProps {
  isOpen: boolean;
  onClose: () => void;
  office: OfficeItem | null;
  departments: DepartmentItem[];
  locations: LocationItem[];
  onSave: (updated: OfficeItem) => void;
}

export function EditOfficeModal({
  isOpen,
  onClose,
  office,
  departments,
  locations,
  onSave,
}: EditOfficeModalProps) {
  const [nameEn, setNameEn] = useState('');
  const [nameSo, setNameSo] = useState('');
  const [departmentCode, setDepartmentCode] = useState('');
  const [locationCode, setLocationCode] = useState('');
  const [physicalAddress, setPhysicalAddress] = useState('');
  const [errors, setErrors] = useState<{ nameEn?: string; nameSo?: string }>({});

  useEffect(() => {
    if (office && isOpen) {
      setNameEn(office.name);
      setNameSo(office.nameSomali || office.name);
      setDepartmentCode(office.departmentCode);
      setLocationCode(office.locationCode || '');
      setPhysicalAddress(office.physicalAddress || '');
      setErrors({});
    }
  }, [office, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !office) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { nameEn?: string; nameSo?: string } = {};

    if (!nameEn.trim()) newErrors.nameEn = 'Name (English) is required';
    if (!nameSo.trim()) newErrors.nameSo = 'Magaca (Soomaali) is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const dept = departments.find((d) => d.code === departmentCode);
    const loc = locations.find((l) => l.code === locationCode);

    onSave({
      ...office,
      name: nameEn.trim(),
      nameSomali: nameSo.trim(),
      departmentCode,
      departmentName: dept?.name || office.departmentName,
      locationCode: locationCode || undefined,
      locationName: loc?.name || undefined,
      physicalAddress: physicalAddress.trim() || undefined,
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
      aria-labelledby="edit-off-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Full Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-hairline bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-hairline px-6 py-5 shrink-0">
          <div>
            <h2 id="edit-off-title" className="text-display font-semibold text-ink">
              {office.code}
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

        <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <div>
              <label className="text-meta font-medium text-ink">Code</label>
              <input
                type="text"
                value={office.code}
                disabled
                className="mt-1.5 w-full font-mono rounded-lg border border-hairline bg-surface/80 px-3.5 py-2 text-body text-ink cursor-not-allowed uppercase"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="edit-off-name-en" className="text-meta font-medium text-ink">
                  Name (English) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="edit-off-name-en"
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
                <label htmlFor="edit-off-name-so" className="text-meta font-medium text-ink">
                  Magaca (Soomaali) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="edit-off-name-so"
                  type="text"
                  value={nameSo}
                  onChange={(e) => setNameSo(e.target.value)}
                  className={`mt-1.5 ${inputBase} ${errors.nameSo ? inputErr : inputOk}`}
                />
                {errors.nameSo && (
                  <p className="mt-1 text-meta text-rose-600">{errors.nameSo}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="edit-off-dept" className="text-meta font-medium text-ink">
                Department <span className="text-rose-500">*</span>
              </label>
              <Listbox
                id="edit-off-dept"
                value={departmentCode}
                onChange={setDepartmentCode}
                options={departments.map((dept) => ({ value: dept.code, label: dept.name }))}
                className="mt-1.5"
              />
            </div>

            <div>
              <label htmlFor="edit-off-loc" className="text-meta font-medium text-ink">
                Location
              </label>
              <Listbox
                id="edit-off-loc"
                value={locationCode}
                onChange={setLocationCode}
                placeholder="None"
                options={locations.map((loc) => ({ value: loc.code, label: loc.name }))}
                className="mt-1.5"
              />
            </div>

            <div>
              <label htmlFor="edit-off-address" className="text-meta font-medium text-ink">
                Physical address
              </label>
              <input
                id="edit-off-address"
                type="text"
                value={physicalAddress}
                onChange={(e) => setPhysicalAddress(e.target.value)}
                className={`mt-1.5 ${inputBase} ${inputOk}`}
              />
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-end gap-3 border-t border-hairline px-6 py-4">
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
