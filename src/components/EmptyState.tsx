import React from 'react';

interface EmptyStateProps {
  icon?: React.ComponentType<{className?: string;strokeWidth?: number;}>;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action
}: EmptyStateProps) {
  return (
    <div className="px-5 py-16 text-center">
      {Icon ?
      <Icon className="mx-auto h-6 w-6 text-muted" strokeWidth={1.5} /> :
      null}
      <p className="mt-4 text-lead font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-body text-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>);

}