import { Fragment, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, InfoIcon } from './icons';

export function RecordCard({ children }: {children: ReactNode;}) {
  return (
    <article className="overflow-hidden rounded-card border border-hairline bg-white shadow-card">
      {children}
    </article>);

}

export function RecordHeader({
  backTo,
  backLabel,
  eyebrow,
  title,
  meta,
  actions







}: {backTo: string;backLabel: string;eyebrow?: ReactNode;title: string;meta?: ReactNode[];actions?: ReactNode;}) {
  return (
    <header className="px-6 py-5">
      <Link
        to={backTo}
        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 -ml-2 text-body text-muted transition-all duration-150 ease-standard hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        
        <ArrowLeftIcon className="h-4 w-4" strokeWidth={1.75} />
        {backLabel}
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-x-5 gap-y-4">
        <div className="min-w-0">
          {eyebrow ? <div className="text-meta font-medium uppercase tracking-[0.07em] text-primary/80">{eyebrow}</div> : null}
          <h1 className="mt-1 text-display font-bold tracking-tight text-ink">{title}</h1>
          {meta && meta.length > 0 ?
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
              {meta.map((item, index) =>
            <Fragment key={index}>
                  {index > 0 ?
              <span
                aria-hidden="true"
                className="h-1 w-1 rounded-full bg-hairline" /> :

              null}
                  {item}
                </Fragment>
            )}
            </div> :
          null}
        </div>

        {actions ?
        <div className="flex flex-wrap items-center gap-2">{actions}</div> :
        null}
      </div>
    </header>);

}

export function RecordBody({ children }: {children: ReactNode;}) {
  return (
    <div className="border-t border-hairline xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,400px)]">
      {children}
    </div>);

}

export function RecordColumn({
  side = false,
  children



}: {side?: boolean;children: ReactNode;}) {
  return (
    <div
      className={[
      'divide-y divide-hairline',
      side ?
      'border-t border-hairline xl:border-l xl:border-t-0' :
      ''].
      join(' ')}>
      
      {children}
    </div>);

}

export function RecordSection({
  id,
  title,
  description,
  collapsibleDescription = false,
  action,
  children






}: {id?: string;title: string;description?: string;collapsibleDescription?: boolean;action?: ReactNode;children: ReactNode;}) {
  return (
    <section id={id} className="scroll-mt-4 px-6 py-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-meta font-semibold uppercase tracking-[0.06em] text-muted">
            <span aria-hidden="true" className="block h-3 w-0.5 rounded-full bg-primary/60" />
            {title}
          </h2>
          {description && collapsibleDescription ? (
            <div className="group relative mt-1 inline-flex items-center">
              <button
                type="button"
                tabIndex={-1}
                aria-label={`${title} explanation`}
                className="cursor-help text-muted/60 transition-colors hover:text-ink focus:outline-none"
              >
                <InfoIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
              <div className="pointer-events-none absolute left-0 top-full z-50 mt-2 hidden w-80 rounded-lg border border-hairline bg-ink p-2.5 text-xs leading-relaxed text-white shadow-2xl group-hover:block group-focus-within:block">
                <div className="absolute -top-1.5 left-3.5 h-3 w-3 rotate-45 border-l border-t border-hairline bg-ink" />
                <span className="relative z-10">{description}</span>
              </div>
            </div>
          ) : description ? (
            <p className="mt-2 max-w-3xl text-body text-muted">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>);

}

export function Fact({
  label,
  value



}: {label: string;value: ReactNode;}) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.07em] text-muted/80">{label}</dt>
      <dd className="mt-1 break-words text-body font-medium text-ink">{value}</dd>
    </div>);

}