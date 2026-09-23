import type { CaseEvent } from '../types/registry';

export function Timeline({ events }: {events: CaseEvent[];}) {
  return (
    <ol className="space-y-0">
      {events.map((event, index) => {
        const isLatest = index === events.length - 1;
        return (
          <li key={`${event.label}-${index}`} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                aria-hidden="true"
                className={[
                  'mt-1.5 h-2 w-2 shrink-0 rounded-full ring-2',
                  isLatest
                    ? 'bg-primary ring-primary/20'
                    : 'bg-hairline ring-white'
                ].join(' ')}
              />
              {index < events.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="mt-1 w-px flex-1 bg-gradient-to-b from-hairline to-transparent"
                  style={{ minHeight: '28px' }}
                />
              ) : null}
            </div>
            <div className="min-w-0 pb-4">
              <p className={['text-body', isLatest ? 'font-semibold text-ink' : 'text-ink'].join(' ')}>
                {event.label}
              </p>
              <p className="mt-0.5 text-meta text-muted">
                {event.at} · {event.actor}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}