import { Listbox } from './Listbox';

interface SelectFilterProps {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  hideLabel?: boolean;
  fullWidth?: boolean;
}

export function SelectFilter({
  id,
  label,
  value,
  options,
  onChange,
  placeholder,
  hideLabel = true,
  fullWidth = false,
}: SelectFilterProps) {
  return (
    <div className={fullWidth ? 'w-full' : undefined}>
      <label htmlFor={id} className={hideLabel ? 'sr-only' : 'mb-1 block text-meta font-medium text-ink'}>
        {label}
      </label>
      <Listbox
        id={id}
        value={value}
        options={options}
        onChange={onChange}
        placeholder={placeholder}
        compact={!fullWidth}
        className={fullWidth ? 'w-full' : undefined}
      />
    </div>
  );
}