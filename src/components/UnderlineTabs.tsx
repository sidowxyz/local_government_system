export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface UnderlineTabsProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  label: string;
}

export function UnderlineTabs({
  items,
  value,
  onChange,
  label
}: UnderlineTabsProps) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="flex min-w-max items-center gap-6 overflow-x-auto border-b border-hairline px-6 bg-white"
    >
      {items.map((item) => {
        const isActive = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
            className={[
              '-mb-px flex items-center gap-2 border-b-2 py-3.5 text-body transition-all duration-150 ease-standard',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              isActive
                ? 'border-primary font-semibold text-primary'
                : 'border-transparent text-muted hover:border-hairline hover:text-ink'
            ].join(' ')}
          >
            {item.label}
            {item.count !== undefined && item.count > 0 ? (
              <span
                className={[
                  'rounded-full px-2 py-0.5 font-mono text-[11px] font-semibold transition-colors duration-150',
                  isActive
                    ? 'bg-primaryLight text-primary ring-1 ring-primary/20'
                    : 'bg-surface text-muted'
                ].join(' ')}
              >
                {item.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}