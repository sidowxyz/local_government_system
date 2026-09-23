import { useState, useEffect } from 'react';
import { XIcon } from './icons';
import { Button } from './Button';
import { Listbox } from './Listbox';

interface MoveModalProps {
  isOpen: boolean;
  code: string;
  options: { code: string; name: string }[];
  onClose: () => void;
  onConfirm: (newParentCode: string) => void;
}

export function MoveModal({
  isOpen,
  code,
  options,
  onClose,
  onConfirm,
}: MoveModalProps) {
  const [selectedParent, setSelectedParent] = useState('');

  useEffect(() => {
    if (isOpen) setSelectedParent('');
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(selectedParent);
    onClose();
  };

  const inputBase =
    'w-full rounded-lg border border-hairline bg-white px-3.5 py-2 text-body text-ink placeholder:text-muted/50 shadow-sm transition-colors duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="move-title"
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
          <h2 id="move-title" className="text-display font-semibold text-ink">
            Move {code}
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

        <form onSubmit={handleConfirm} className="space-y-4 px-6 py-5">
          <p className="text-body text-muted leading-relaxed">
            Every officer with DIVISION scope under the old or the new parent will see a different set of records after this.
          </p>

          <div>
            <label htmlFor="move-parent" className="text-meta font-medium text-ink">
              New parent
            </label>
            <Listbox
              id="move-parent"
              value={selectedParent}
              onChange={setSelectedParent}
              placeholder="None — top level"
              options={options
                .filter((opt) => opt.code !== code)
                .map((opt) => ({ value: opt.code, label: `${opt.name} (${opt.code})` }))}
              className="mt-1.5"
            />
            <p className="mt-1 text-meta text-muted">
              Leave empty to make it top-level.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-hairline pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Confirm
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
