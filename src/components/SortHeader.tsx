import { ChevronsUpDownIcon, ChevronUpIcon, ChevronDownIcon } from './icons';

export type SortDirection = 'asc' | 'desc';

interface SortHeaderProps {
  label: string;
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
  align?: 'left' | 'right';
}

export function SortHeader({
  label,
  active,
  direction,
  onClick,
  align = 'left'
}: SortHeaderProps) {
  const Icon = !active ?
  ChevronsUpDownIcon :
  direction === 'asc' ?
  ChevronUpIcon :
  ChevronDownIcon;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Sort by ${label}`}
      aria-pressed={active}
      className={[
      'inline-flex items-center gap-1 rounded-md text-meta font-medium uppercase tracking-[0.06em] transition-colors duration-150 ease-standard',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      align === 'right' ? 'flex-row-reverse' : '',
      active ? 'text-primary' : 'text-muted hover:text-ink'].
      join(' ')}>
      
      {label}
      <Icon className="h-3.5 w-3.5" strokeWidth={1.75} weight="duotone" />
    </button>);

}