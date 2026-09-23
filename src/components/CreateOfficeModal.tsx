import { useState, useEffect } from 'react';
import { XIcon } from './icons';
import { Button } from './Button';
import { Listbox } from './Listbox';
import type { OfficeItem, DepartmentItem, LocationItem } from '../data/organisation';

interface CreateOfficeModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: DepartmentItem[];
  locations: LocationItem[];
  offices: OfficeItem[];
  onSave: (office: OfficeItem) => void;
}

export function CreateOfficeModal({
  isOpen,
  onClose,
  departments,
  locations,
  offices,
  onSave,
}: CreateOfficeModalProps) {
  const [code, setCode] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameSo, setNameSo] = useState('');
  const [departmentCode, setDepartmentCode] = useState('');
  const [locationCode, setLocationCode] = useState('');
  const [parentOfficeCode, setParentOfficeCode] = useState('');
  const [physicalAddress, setPhysicalAddress] = useState('');
  const [errors, setErrors] = useState<{ code?: string; nameEn?: string; nameSo?: string; departmentCode?: string }>({});

  useEffect(() => {
    if (isOpen) {
      setCode('');
      setNameEn('');
      setNameSo('');
      setDepartmentCode(departments[0]?.code || '');
      setLocationCode('');
      setParentOfficeCode('');
      setPhysicalAddress('');
      setErrors({});
    }
  }, [isOpen, departments]);

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
    const newErrors: { code?: string; nameEn?: string; nameSo?: string; departmentCode?: string } = {};

    if (!code.trim()) newErrors.code = 'Code is required';
    if (!nameEn.trim()) newErrors.nameEn = 'Name (English) is required';
    if (!nameSo.trim()) newErrors.nameSo = 'Magaca (Soomaali) is required';
    if (!departmentCode) newErrors.departmentCode = 'Department is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const dept = departments.find((d) => d.code === departmentCode);
    const loc = locations.find((l) => l.code === locationCode);

    const newOffice: OfficeItem = {
      id: `off-${Date.now()}`,
      code: code.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_'),
      name: nameEn.trim(),
      nameSomali: nameSo.trim(),
      departmentCode,
      departmentName: dept?.name || departmentCode,
      locationCode: locationCode || undefined,
      locationName: loc?.name || undefined,
      parentOfficeCode: parentOfficeCode || undefined,
      physicalAddress: physicalAddress.trim() || undefined,
    };

    onSave(newOffice);
    onClose();
  };

  const inputBase =
    'w-full rounded-lg border bg-white px-3.5 py-2 text-body text-ink placeholder:text-muted/50 shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2';
  const inputOk = 'border-hairline focus:border-primary focus:ring-primary/20';
  const inputErr = 'border-rose-300 focus:border-rose-500 focus:ring-rose-200';

  const deptOffices = offices.filter(
    (o) => !departmentCode || o.departmentCode === departmentCode
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-office-title"
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
          <h2 id="create-office-title" className="text-display font-semibold text-ink">
            New office
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

        <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <div>
              <label htmlFor="office-code" className="text-meta font-medium text-ink">
                Code <span className="text-rose-500">*</span>
              </label>
              <input
                id="office-code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_'))}
                placeholder="HODAN_HQ"
                className={`mt-1.5 font-mono uppercase ${inputBase} ${
                  errors.code ? inputErr : inputOk
                }`}
              />
              <p className="mt-1 text-meta text-muted">
                UPPER_SNAKE_CASE. Permanent once saved.
              </p>
              {errors.code && (
                <p className="mt-1 text-meta text-rose-600">{errors.code}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="office-name-en" className="text-meta font-medium text-ink">
                  Name (English) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="office-name-en"
                  type="text"
                  value={nameEn}
                  onChange={(e) => handleNameEnChange(e.target.value)}
                  placeholder="e.g. Hodan Central Office"
                  className={`mt-1.5 ${inputBase} ${
                    errors.nameEn ? inputErr : inputOk
                  }`}
                />
                {errors.nameEn && (
                  <p className="mt-1 text-meta text-rose-600">{errors.nameEn}</p>
                )}
              </div>

              <div>
                <label htmlFor="office-name-so" className="text-meta font-medium text-ink">
                  Magaca (Soomaali) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="office-name-so"
                  type="text"
                  value={nameSo}
                  onChange={(e) => setNameSo(e.target.value)}
                  placeholder="e.g. Xafiiska Dhexe ee Hodan"
                  className={`mt-1.5 ${inputBase} ${
                    errors.nameSo ? inputErr : inputOk
                  }`}
                />
                {errors.nameSo && (
                  <p className="mt-1 text-meta text-rose-600">{errors.nameSo}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="office-dept" className="text-meta font-medium text-ink">
                Department <span className="text-rose-500">*</span>
              </label>
              <Listbox
                id="office-dept"
                value={departmentCode}
                onChange={setDepartmentCode}
                placeholder="Select…"
                options={departments.map((dept) => ({ value: dept.code, label: `${dept.name} (${dept.code})` }))}
                className="mt-1.5"
              />
              {errors.departmentCode && (
                <p className="mt-1 text-meta text-rose-600">{errors.departmentCode}</p>
              )}
            </div>

            <div>
              <label htmlFor="office-location" className="text-meta font-medium text-ink">
                Location
              </label>
              <Listbox
                id="office-location"
                value={locationCode}
                onChange={setLocationCode}
                placeholder="None"
                options={locations.map((loc) => ({ value: loc.code, label: `${loc.name} (${loc.type})` }))}
                className="mt-1.5"
              />
            </div>

            <div>
              <label htmlFor="office-parent" className="text-meta font-medium text-ink">
                Parent office
              </label>
              <Listbox
                id="office-parent"
                value={parentOfficeCode}
                onChange={setParentOfficeCode}
                placeholder="None"
                options={deptOffices.map((off) => ({ value: off.code, label: `${off.name} (${off.code})` }))}
                className="mt-1.5"
              />
              <p className="mt-1 text-meta text-muted">
                Choose a department first.
              </p>
            </div>

            <div>
              <label htmlFor="office-address" className="text-meta font-medium text-ink">
                Physical address
              </label>
              <input
                id="office-address"
                type="text"
                value={physicalAddress}
                onChange={(e) => setPhysicalAddress(e.target.value)}
                placeholder="e.g. Wadada Maka Al-Mukarama, Hodan"
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
