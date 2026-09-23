import { CheckIcon, AlertCircleIcon } from './icons';
import type { CaseStatus } from '../types/registry';

const dotColors: Record<CaseStatus, string> = {
  OPEN: 'bg-primary ring-2 ring-primary/20',
  COMPLETED: 'bg-emerald-600 ring-2 ring-emerald-200',
  CANCELLED: 'bg-muted ring-2 ring-muted/20'
};

function toSentenceCase(value: string): string {
  const spaced = value.replace(/_/g, ' ').toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function CaseStateCell({
  state,
  status,
  sentenceCase = false
}: {
  state: string;
  status: CaseStatus;
  sentenceCase?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2 text-body font-medium text-ink">
      <span
        aria-hidden="true"
        className={`h-2 w-2 shrink-0 rounded-full ${dotColors[status]}`}
      />
      {sentenceCase ? toSentenceCase(state) : state}
    </span>
  );
}

export function CaseStatusCell({ status }: { status: CaseStatus }) {
  return <span className="font-mono text-meta font-medium text-ink">{status}</span>;
}

const statusBadges: Record<CaseStatus, string> = {
  OPEN: 'border-primary/20 bg-primaryLight text-primary',
  COMPLETED: 'border-emerald-200 bg-emerald-50 text-success',
  CANCELLED: 'border-hairline bg-surface text-muted'
};

export function StatusBadge({ status }: { status: CaseStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-meta font-semibold ${statusBadges[status]}`}
    >
      {toSentenceCase(status)}
    </span>
  );
}

export function PaymentBadge({
  paid,
  applicable = true
}: {
  paid: boolean;
  applicable?: boolean;
}) {
  if (!applicable) {
    return (
      <span className="inline-flex items-center rounded-full border border-hairline bg-surface px-2.5 py-0.5 text-meta font-medium text-muted">
        Not applicable
      </span>
    );
  }

  return paid ? (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-meta font-semibold text-emerald-700">
      <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
      Paid
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-danger/20 bg-danger/5 px-2.5 py-0.5 text-meta font-semibold text-danger">
      <AlertCircleIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
      Unpaid
    </span>
  );
}