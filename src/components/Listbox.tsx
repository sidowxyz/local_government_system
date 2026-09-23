import {
  useState,
  useRef,
  useEffect,
  useId,
} from 'react';
import { TickIcon, ChevronDownIcon } from './icons';

interface Option {
  value: string;
  label: string;
}

interface ListboxProps {
  id?: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** If true, renders a smaller compact trigger (for toolbar filters) */
  compact?: boolean;
}

export function Listbox({
  id: externalId,
  value,
  options,
  onChange,
  placeholder = 'Select…',
  disabled = false,
  className = '',
  compact = false,
}: ListboxProps) {
  const internalId = useId();
  const id = externalId ?? internalId;
  const listId = `${id}-list`;

  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = options.find((o) => o.value === value);
  const displayLabel = selected?.label ?? null;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (!open || highlightedIndex < 0) return;
    const item = listRef.current?.children[highlightedIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: 'nearest' });
  }, [highlightedIndex, open]);

  function toggle() {
    if (disabled) return;
    setOpen((prev) => {
      if (!prev) {
        // Pre-highlight current value
        const idx = options.findIndex((o) => o.value === value);
        setHighlightedIndex(idx >= 0 ? idx : 0);
      }
      return !prev;
    });
  }

  function select(optValue: string) {
    onChange(optValue);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    const allOptions = options;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) { setOpen(true); setHighlightedIndex(0); return; }
      setHighlightedIndex((i) => Math.min(i + 1, allOptions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!open) { setOpen(true); return; }
      if (highlightedIndex >= 0) select(allOptions[highlightedIndex].value);
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      setOpen(false);
    }
  }

  const triggerBase = compact
    ? 'inline-flex min-w-[160px] items-center justify-between gap-2 rounded-lg border border-hairline bg-white px-3 py-2 text-body shadow-card transition-all duration-150 ease-standard focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
    : 'w-full flex items-center justify-between gap-2 rounded-lg border border-hairline bg-white px-3.5 py-2.5 text-body shadow-card transition-all duration-150 ease-standard focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

  const triggerColor = !displayLabel
    ? 'text-muted/70'
    : 'text-ink font-medium';

  const disabledClass = disabled
    ? 'cursor-not-allowed border-hairline bg-surface text-muted opacity-60'
    : 'cursor-pointer hover:border-primary/40';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-activedescendant={
          open && highlightedIndex >= 0
            ? `${id}-opt-${highlightedIndex}`
            : undefined
        }
        disabled={disabled}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className={[triggerBase, triggerColor, disabledClass].join(' ')}
      >
        <span className="truncate">
          {displayLabel ?? placeholder}
        </span>
        <ChevronDownIcon
          className={[
            'h-4 w-4 shrink-0 text-muted transition-transform duration-150',
            open ? 'rotate-180' : '',
          ].join(' ')}
          strokeWidth={1.75}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Options"
          className="absolute left-0 z-50 mt-1.5 max-h-60 min-w-full max-w-[calc(100vw-2rem)] overflow-auto rounded-xl border border-hairline bg-white py-1.5 shadow-cardHover focus:outline-none"
          style={{ minWidth: '100%' }}
        >
          {/* Clear / placeholder option */}
          {placeholder !== undefined && (
            <li
              id={`${id}-opt-placeholder`}
              role="option"
              aria-selected={value === ''}
              onClick={() => select('')}
              onMouseEnter={() => setHighlightedIndex(-1)}
              className={[
                'flex cursor-pointer items-center gap-2 px-3 py-2 text-body transition-colors duration-100',
                value === ''
                  ? 'bg-primaryLight text-primary'
                  : 'text-muted hover:bg-surface',
              ].join(' ')}
            >
              <span className="flex-1 italic">{placeholder}</span>
              {value === '' && (
                <TickIcon className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2.5} />
              )}
            </li>
          )}

          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = index === highlightedIndex;
            return (
              <li
                key={option.value}
                id={`${id}-opt-${index}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => select(option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={[
                  'flex cursor-pointer items-center gap-2 px-3 py-2 text-body transition-colors duration-100',
                  isSelected
                    ? 'bg-primaryLight font-medium text-primary'
                    : isHighlighted
                    ? 'bg-surface text-ink'
                    : 'text-ink hover:bg-surface',
                ].join(' ')}
              >
                <span className="flex-1 truncate">{option.label}</span>
                {isSelected && (
                  <TickIcon className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2.5} />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
