import { useState, useEffect } from 'react';
import { XIcon, PlusIcon } from './icons';
import { Button } from './Button';
import type { TariffVersion, TariffComponent, ChargeBasis, LookupRow } from '../data/tariffs';

interface NewVersionModalProps {
  isOpen: boolean;
  tariffCode: string;
  onClose: () => void;
  onSave: (version: TariffVersion) => void;
}

/* ------------------------------------------------------------------ */
/*  Blank component factory                                           */
/* ------------------------------------------------------------------ */
function blankComponent(idx: number): TariffComponent {
  return {
    id: `draft-comp-${Date.now()}-${idx}`,
    code: '',
    labelEn: '',
    labelSo: '',
    basis: 'FIXED',
    amount: 0,
    lookupField: '',
    lookupValues: [],
  };
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export function NewVersionModal({
  isOpen,
  tariffCode,
  onClose,
  onSave,
}: NewVersionModalProps) {
  const [effectiveDate, setEffectiveDate] = useState('');
  const [approvalDoc, setApprovalDoc] = useState('');
  const [components, setComponents] = useState<TariffComponent[]>([blankComponent(0)]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setEffectiveDate('');
      setApprovalDoc('');
      setComponents([blankComponent(0)]);
      setErrors({});
    }
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  /* ---------- component field helpers ---------- */

  const updateComponent = (idx: number, patch: Partial<TariffComponent>) => {
    setComponents((prev) => prev.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  };

  const removeComponent = (idx: number) => {
    if (components.length <= 1) return;
    setComponents((prev) => prev.filter((_, i) => i !== idx));
  };

  const addLookupRow = (compIdx: number) => {
    setComponents((prev) =>
      prev.map((c, i) =>
        i === compIdx
          ? { ...c, lookupValues: [...(c.lookupValues || []), { label: '', amount: 0 }] }
          : c
      )
    );
  };

  const updateLookupRow = (compIdx: number, rowIdx: number, patch: Partial<LookupRow>) => {
    setComponents((prev) =>
      prev.map((c, i) => {
        if (i !== compIdx) return c;
        const rows = [...(c.lookupValues || [])];
        rows[rowIdx] = { ...rows[rowIdx], ...patch };
        return { ...c, lookupValues: rows };
      })
    );
  };

  const removeLookupRow = (compIdx: number, rowIdx: number) => {
    setComponents((prev) =>
      prev.map((c, i) => {
        if (i !== compIdx) return c;
        return { ...c, lookupValues: (c.lookupValues || []).filter((_, ri) => ri !== rowIdx) };
      })
    );
  };

  /* ---------- submit ---------- */

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!effectiveDate) errs.effectiveDate = 'Required';

    components.forEach((comp, idx) => {
      if (!comp.code.trim()) errs[`comp-${idx}-code`] = 'Required';
      if (!comp.labelEn.trim()) errs[`comp-${idx}-labelEn`] = 'Required';
      if (!comp.labelSo.trim()) errs[`comp-${idx}-labelSo`] = 'Required';

      if (comp.basis === 'FIXED' && (comp.amount === undefined || comp.amount < 0)) {
        errs[`comp-${idx}-amount`] = 'Required';
      }

      if ((comp.basis === 'LOOKUP' || comp.basis === 'DIFFERENCE') && !comp.lookupField?.trim()) {
        errs[`comp-${idx}-lookupField`] = 'Required';
      }
    });

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const version: TariffVersion = {
      id: `ver-${Date.now()}`,
      effectiveDate,
      untilDate: null,
      approvalDocument: approvalDoc.trim() || undefined,
      components: components.map((c) => ({
        ...c,
        id: `comp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        code: c.code.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_'),
      })),
    };

    onSave(version);
    onClose();
  };

  const basisOptions: { value: ChargeBasis; label: string; desc: string }[] = [
    { value: 'FIXED', label: 'Fixed amount', desc: 'One amount, whatever the answers.' },
    { value: 'LOOKUP', label: 'Lookup', desc: 'Price depends on a form field value.' },
    { value: 'DIFFERENCE', label: 'Difference', desc: 'Charges the gap between old and new tier.' },
  ];

  const inputBase =
    'w-full rounded-lg border bg-white px-3.5 py-2 text-body text-ink placeholder:text-muted/50 shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2';
  const inputOk = 'border-hairline focus:border-primary focus:ring-primary/20';
  const inputErr = 'border-rose-300 focus:border-rose-500 focus:ring-rose-200';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-version-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Full Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-hairline bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-hairline px-6 py-4 shrink-0">
          <div>
            <h2 id="new-version-title" className="text-display font-semibold text-ink">
              New version — {tariffCode}
            </h2>
            <p className="mt-0.5 text-meta text-muted">
              A version cannot be edited once it has priced an invoice. Adding one is how a fee
              changes.
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

        {/* Form Body — scrollable */}
        <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Effective date */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="ver-effective" className="text-meta font-medium text-ink">
                  Effective from <span className="text-rose-500">*</span>
                </label>
                <input
                  id="ver-effective"
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className={`mt-1.5 ${inputBase} ${errors.effectiveDate ? inputErr : inputOk}`}
                />
                <p className="mt-1 text-meta text-muted">
                  Everything raised on or after this date is priced by this version.
                </p>
                {errors.effectiveDate && (
                  <p className="mt-1 text-meta text-rose-600">{errors.effectiveDate}</p>
                )}
              </div>
              <div>
                <label htmlFor="ver-approval" className="text-meta font-medium text-ink">
                  Approval document <span className="text-muted font-normal">optional</span>
                </label>
                <input
                  id="ver-approval"
                  type="text"
                  value={approvalDoc}
                  onChange={(e) => setApprovalDoc(e.target.value)}
                  placeholder="e.g. By-law 03/2024"
                  className={`mt-1.5 ${inputBase} ${inputOk}`}
                />
                <p className="mt-1 text-meta text-muted">
                  The by-law or council decision this rate comes from.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <h3 className="text-body font-semibold text-ink">Components</h3>
              <div className="flex-1 border-t border-hairline" />
              <Button
                type="button"
                variant="secondary"
                onClick={() => setComponents((prev) => [...prev, blankComponent(prev.length)])}
                className="py-1 px-2.5 text-meta"
              >
                <PlusIcon className="h-3.5 w-3.5" />
                Add component
              </Button>
            </div>

            {/* Component cards */}
            {components.map((comp, idx) => (
              <div
                key={comp.id}
                className="rounded-xl border border-hairline bg-surface/30 overflow-hidden"
              >
                {/* Component header */}
                <div className="flex items-center justify-between border-b border-hairline bg-surface/60 px-4 py-2">
                  <span className="text-meta font-semibold text-ink">Component {idx + 1}</span>
                  {components.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeComponent(idx)}
                      className="text-meta text-rose-500 hover:text-rose-700 font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="space-y-4 p-4">
                  {/* Code */}
                  <div>
                    <label className="text-meta font-medium text-ink">
                      Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={comp.code}
                      onChange={(e) =>
                        updateComponent(idx, {
                          code: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_'),
                        })
                      }
                      placeholder="e.g. BASE_FEE"
                      className={`mt-1 font-mono uppercase ${inputBase} ${
                        errors[`comp-${idx}-code`] ? inputErr : inputOk
                      }`}
                    />
                  </div>

                  {/* Labels */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-meta font-medium text-ink">
                        Label (English) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={comp.labelEn}
                        onChange={(e) => updateComponent(idx, { labelEn: e.target.value })}
                        placeholder="e.g. Registration fee"
                        className={`mt-1 ${inputBase} ${
                          errors[`comp-${idx}-labelEn`] ? inputErr : inputOk
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-meta font-medium text-ink">
                        Calaamadda (Soomaali) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={comp.labelSo}
                        onChange={(e) => updateComponent(idx, { labelSo: e.target.value })}
                        placeholder="e.g. Lacagta diiwaangelinta"
                        className={`mt-1 ${inputBase} ${
                          errors[`comp-${idx}-labelSo`] ? inputErr : inputOk
                        }`}
                      />
                    </div>
                  </div>

                  {/* Basis selector */}
                  <div>
                    <label className="text-meta font-medium text-ink">
                      How it is charged <span className="text-rose-500">*</span>
                    </label>
                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      {basisOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            const patch: Partial<TariffComponent> = { basis: opt.value };
                            if (opt.value === 'FIXED') {
                              patch.amount = comp.amount ?? 0;
                              patch.lookupField = '';
                              patch.lookupValues = [];
                            } else {
                              patch.amount = undefined;
                              patch.lookupField = comp.lookupField || '';
                              patch.lookupValues = comp.lookupValues?.length
                                ? comp.lookupValues
                                : [{ label: '', amount: 0 }];
                            }
                            updateComponent(idx, patch);
                          }}
                          className={[
                            'rounded-lg border px-3 py-2.5 text-left transition-all duration-150',
                            comp.basis === opt.value
                              ? 'border-primary bg-primaryLight/60 ring-1 ring-primary/30'
                              : 'border-hairline bg-white hover:border-primary/40 hover:bg-surface/50',
                          ].join(' ')}
                        >
                          <span className="block text-meta font-semibold text-ink">
                            {opt.label}
                          </span>
                          <span className="block mt-0.5 text-[11px] text-muted leading-snug">
                            {opt.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fixed amount */}
                  {comp.basis === 'FIXED' && (
                    <div>
                      <label className="text-meta font-medium text-ink">
                        Amount <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={comp.amount ?? ''}
                        onChange={(e) =>
                          updateComponent(idx, { amount: parseFloat(e.target.value) || 0 })
                        }
                        placeholder="0.00"
                        className={`mt-1 ${inputBase} ${
                          errors[`comp-${idx}-amount`] ? inputErr : inputOk
                        }`}
                      />
                    </div>
                  )}

                  {/* Lookup / Difference fields */}
                  {(comp.basis === 'LOOKUP' || comp.basis === 'DIFFERENCE') && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-meta font-medium text-ink">
                          Lookup field <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={comp.lookupField || ''}
                          onChange={(e) => updateComponent(idx, { lookupField: e.target.value })}
                          placeholder="e.g. form.categoryCode"
                          className={`mt-1 font-mono ${inputBase} ${
                            errors[`comp-${idx}-lookupField`] ? inputErr : inputOk
                          }`}
                        />
                      </div>

                      {/* Lookup rows */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-meta font-medium text-ink">Values</span>
                          <button
                            type="button"
                            onClick={() => addLookupRow(idx)}
                            className="text-meta text-primary font-medium hover:underline"
                          >
                            + Add row
                          </button>
                        </div>

                        {(comp.lookupValues || []).map((row, ri) => (
                          <div key={ri} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={row.label}
                              onChange={(e) =>
                                updateLookupRow(idx, ri, { label: e.target.value })
                              }
                              placeholder="Label"
                              className={`flex-1 ${inputBase} ${inputOk} !py-1.5 !text-meta`}
                            />
                            <div className="relative w-32">
                              <input
                                type="number"
                                min="0"
                                value={row.amount}
                                onChange={(e) =>
                                  updateLookupRow(idx, ri, {
                                    amount: parseInt(e.target.value) || 0,
                                  })
                                }
                                className={`w-full ${inputBase} ${inputOk} !py-1.5 !text-meta !pr-10`}
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-meta text-muted pointer-events-none">
                                USD
                              </span>
                            </div>
                            {(comp.lookupValues || []).length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeLookupRow(idx, ri)}
                                className="shrink-0 p-1 text-muted hover:text-rose-600"
                              >
                                <XIcon className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="shrink-0 flex items-center justify-end gap-3 border-t border-hairline px-6 py-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
