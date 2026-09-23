import type { ReactNode } from 'react';

interface PageHeadingProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  actions?: ReactNode;
}

export function PageHeading({ title, subtitle, action, actions }: PageHeadingProps) {
  const actionElement = action ?? actions;

  return (
    <div className="mb-6 flex items-start justify-between gap-5">
      <div>
        <h1 className="text-display font-bold tracking-tight text-ink">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-body text-muted">{subtitle}</p>
        ) : null}
      </div>
      {actionElement}
    </div>
  );
}