import { useState, useEffect } from 'react';
import { XIcon } from './icons';
import { Button } from './Button';
import { Listbox } from './Listbox';
import {
  tariffCategories,
  type Tariff,
  type TariffCategory,
  type ChargeBasis,
} from '../data/tariffs';

interface CreateTariffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tariff: Tariff) => void;
}

export function CreateTariffModal({
  isOpen,
  onClose,
  onSave,
}: CreateTariffModalProps) {
  const [code, setCode] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameSo, setNameSo] = useState('');
  const [category, setCategory] = useState<TariffCategory>('Business Licensing');
  const [basis, setBasis] = useState<ChargeBasis>('FIXED');
  const [initialAmount, setInitialAmount] = useState<number>(1000);
  const [lookupField, setLookupField] = useState('form.categoryCode');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ code?: string; nameEn?: string; nameSo?: string }>({});

  useEffect(() => {
    if (isOpen) {
      setCode('');
      setNameEn('');
      setNameSo('');
      setCategory('Business Licensing');
      setBasis('FIXED');
      setInitialAmount(1000);
      setLookupField('form.categoryCode');
      setDescription('');
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

    const todayStr = new Date().toISOString().slice(0, 10);

    const initialComponent = basis === 'FIXED'
      ? {
        id: `comp-${Date.now()}-1`,
        code: `${code.trim().toUpperCase()}_BASE`,
        labelEn: nameEn.trim(),
        labelSo: nameSo.trim(),
        basis: 'FIXED' as const,
        amount: initialAmount,
      }
      : {
        id: `comp-${Date.now()}-1`,
        code: `${code.trim().toUpperCase()}_LOOKUP`,
        labelEn: nameEn.trim(),
        labelSo: nameSo.trim(),
        basis,
        lookupField: lookupField.trim() || 'form.categoryCode',
        lookupValues: [
          { label: 'Standard — Level 1', amount: 3000 },
          { label: 'Standard — Level 2', amount: 6000 },
          { label: 'Commercial — Tier A', amount: 12000 },
          { label: 'Commercial — Tier B', amount: 25000 },
        ],
      };

    const newTariff: Tariff = {
      id: `tariff-${Date.now()}`,
      name: nameEn.trim(),
      nameSomali: nameSo.trim(),
      code: code.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_'),
      category,
      status: 'Active',
      description: description.trim() || `Official tariff schedule for ${nameEn.trim()}.`,
      serviceCodes: [],
      versions: [
        {
          id: `v-${Date.now()}-1`,
          effectiveDate: todayStr,
          untilDate: null,
          approvalDocument: 'Council Resolution',
          components: [initialComponent],
        },
      ],
    };

    onSave(newTariff);
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
      aria-labelledby="create-tariff-title"
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
        {/* Header */}
        <div className="flex items-center justify-between border-b border-hairline px-6 py-4 shrink-0">
          <div>
            <h2 id="create-tariff-title" className="text-display font-semibold text-ink">
              New tariff schedule
            </h2>
            <p className="mt-0.5 text-meta text-muted">
              Define a new revenue tariff schedule and its initial pricing structure.
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {/* Code */}
            <div>
              <label htmlFor="create-tariff-code" className="text-meta font-medium text-ink">
                Tariff Code <span className="text-rose-500">*</span>
              </label>
              <input
                id="create-tariff-code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_'))}
                placeholder="e.g. BIZ_RENEWAL_FEE"
                className={`mt-1.5 font-mono uppercase ${inputBase} ${
                  errors.code ? inputErr : inputOk
                }`}
              />
              <p className="mt-1 text-meta text-muted">
                UPPER_SNAKE_CASE. Unique identifier used by invoice assessment engines.
              </p>
              {errors.code && (
                <p className="mt-1 text-meta text-rose-600">{errors.code}</p>
              )}
            </div>

            {/* Name English & Somali */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="create-tariff-name-en" className="text-meta font-medium text-ink">
                  Name (English) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="create-tariff-name-en"
                  type="text"
                  value={nameEn}
                  onChange={(e) => handleNameEnChange(e.target.value)}
                  placeholder="e.g. Business renewal fee"
                  className={`mt-1.5 ${inputBase} ${
                    errors.nameEn ? inputErr : inputOk
                  }`}
                />
                {errors.nameEn && (
                  <p className="mt-1 text-meta text-rose-600">{errors.nameEn}</p>
                )}
              </div>

              <div>
                <label htmlFor="create-tariff-name-so" className="text-meta font-medium text-ink">
                  Name (Somali) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="create-tariff-name-so"
                  type="text"
                  value={nameSo}
                  onChange={(e) => setNameSo(e.target.value)}
                  placeholder="e.g. Khidmadda cusboonaysiinta"
                  className={`mt-1.5 ${inputBase} ${
                    errors.nameSo ? inputErr : inputOk
                  }`}
                />
                {errors.nameSo && (
                  <p className="mt-1 text-meta text-rose-600">{errors.nameSo}</p>
                )}
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="create-tariff-category" className="text-meta font-medium text-ink">
                Department Category
              </label>
              <Listbox
                id="create-tariff-category"
                value={category}
                onChange={(value) => setCategory(value as TariffCategory)}
                options={tariffCategories.map((cat) => ({ value: cat, label: cat }))}
                className="mt-1.5"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="create-tariff-desc" className="text-meta font-medium text-ink">
                Description <span className="text-muted font-normal">optional</span>
              </label>
              <input
                id="create-tariff-desc"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Standard fee for commercial annual license renewal"
                className={`mt-1.5 ${inputBase} ${inputOk}`}
              />
            </div>

            {/* Initial Pricing Basis */}
            <div>
              <label className="text-meta font-medium text-ink">
                Initial Pricing Structure
              </label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(
                  [
                    { value: 'FIXED', label: 'Fixed Fee', desc: 'Flat rate amount' },
                    { value: 'LOOKUP', label: 'Lookup Table', desc: 'Tier-based rates' },
                    { value: 'DIFFERENCE', label: 'Difference', desc: 'Tier gap charge' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setBasis(opt.value)}
                    className={[
                      'rounded-lg border px-3 py-2 text-left transition-all',
                      basis === opt.value
                        ? 'border-primary bg-primaryLight text-primary ring-1 ring-primary/30'
                        : 'border-hairline bg-surface/30 text-muted hover:border-primary/40 hover:text-ink',
                    ].join(' ')}
                  >
                    <span className="block text-meta font-semibold">{opt.label}</span>
                    <span className="block text-[10px] text-muted leading-tight mt-0.5">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Initial Rate input if fixed */}
            {basis === 'FIXED' ? (
              <div>
                <label htmlFor="create-tariff-amount" className="text-meta font-medium text-ink">
                  Standard Rate (USD)
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="create-tariff-amount"
                    type="number"
                    min="0"
                    value={initialAmount}
                    onChange={(e) => setInitialAmount(parseFloat(e.target.value) || 0)}
                    className={`${inputBase} ${inputOk} pr-14`}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-meta font-medium text-muted">
                    USD
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="create-tariff-lookup" className="text-meta font-medium text-ink">
                  Lookup Field
                </label>
                <input
                  id="create-tariff-lookup"
                  type="text"
                  value={lookupField}
                  onChange={(e) => setLookupField(e.target.value)}
                  placeholder="e.g. form.categoryCode"
                  className={`mt-1.5 font-mono ${inputBase} ${inputOk}`}
                />
                <p className="mt-1 text-meta text-muted">
                  Default lookup tiers will be pre-populated and can be modified in new versions.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="shrink-0 flex items-center justify-end gap-3 border-t border-hairline px-6 py-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create tariff
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
