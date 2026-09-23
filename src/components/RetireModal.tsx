import { useEffect } from 'react';
import { XIcon } from './icons';
import { Button } from './Button';

interface RetireModalProps {
  isOpen: boolean;
  code: string;
  name: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function RetireModal({
  isOpen,
  code,
  name,
  onClose,
  onConfirm,
}: RetireModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="retire-title"
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
          <h2 id="retire-title" className="text-display font-semibold text-ink">
            Retire {code}
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

        <div className="max-h-[calc(90vh-88px)] overflow-y-auto space-y-4 px-6 py-5">
          <p className="text-body text-muted leading-relaxed">
            It stops being offered. Records already pointing at it keep resolving.
          </p>

          <div className="rounded-lg border border-hairline bg-surface/50 p-3.5">
            <span className="block text-body font-bold text-ink">
              {name}
            </span>
            <span className="font-mono text-[11px] text-muted uppercase mt-0.5 block">
              {code}
            </span>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-hairline pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white border-transparent"
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
