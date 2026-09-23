import type React from 'react';
import { Listbox } from '../Listbox';
import { InfoIcon } from '../icons';

export const controlClasses =
  'w-full rounded-lg border border-hairline bg-white px-3.5 py-2.5 text-body text-ink placeholder:text-muted/70 shadow-card transition-all duration-150 ease-standard focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

export function RequiredMark() {
  return (
    <span aria-hidden="true" className="ml-1 font-bold text-danger">
      *
    </span>
  );
}

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

export function Field({ id, label, required, hint, children }: FieldProps) {
  return (
    <div>
      <div className="flex items-center gap-1.5">
        <label htmlFor={id} className="block text-body font-semibold text-ink">
          {label}
          {required ? <RequiredMark /> : null}
        </label>
        {hint ? (
          <InfoHint label={label} text={hint} />
        ) : null}
      </div>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

export function TextField(
  props: React.InputHTMLAttributes<HTMLInputElement> & { id: string }
) {
  const { className = '', ...rest } = props;
  return <input className={`${controlClasses} ${className}`} {...rest} />;
}

export function TextareaField(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { id: string }
) {
  const { className = '', rows = 3, ...rest } = props;
  return (
    <textarea rows={rows} className={`${controlClasses} ${className}`} {...rest} />
  );
}

interface SelectFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function SelectField({
  id,
  value,
  onChange,
  options,
  placeholder = 'Select…',
  disabled,
  className = '',
}: SelectFieldProps) {
  return (
    <Listbox
      id={id}
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full ${className}`}
    />
  );
}

interface PhoneFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
}

export function PhoneField({
  id,
  value,
  onChange,
  prefix = '+252'
}: PhoneFieldProps) {
  return (
    <div className="flex items-stretch overflow-hidden rounded-lg border border-hairline bg-white shadow-card transition-all duration-150 ease-standard focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
      <span className="flex items-center border-r border-hairline bg-surface/70 px-3.5 font-mono text-body font-medium text-muted">
        {prefix}
      </span>
      <input
        id={id}
        type="tel"
        inputMode="tel"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 bg-white px-3.5 py-2.5 font-mono text-body text-ink focus:outline-none"
      />
    </div>
  );
}

interface ChoiceGroupProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  hint?: string;
}

export function ChoiceGroup({
  label,
  options,
  value,
  onChange,
  required,
  hint
}: ChoiceGroupProps) {
  return (
    <fieldset>
      <div className="flex items-center gap-1.5">
        <legend className="text-body font-medium text-ink">
          {label}
          {required ? <RequiredMark /> : null}
        </legend>
        {hint ? (
          <InfoHint label={label} text={hint} />
        ) : null}
      </div>
      <div className="mt-2 inline-flex flex-wrap items-center gap-1 rounded-lg border border-hairline bg-surface p-1 shadow-card">
        {options.map((option) => {
          const isActive = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(option.value)}
              className={[
                'rounded-md px-3.5 py-1.5 text-body font-medium transition-all duration-150 ease-standard',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                isActive
                  ? 'bg-primary text-white shadow-sm font-semibold'
                  : 'text-muted hover:bg-white/80 hover:text-ink'
              ].join(' ')}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function InfoHint({ label, text }: { label: string; text: string }) {
  return (
    <div className="group relative inline-flex items-center">
      <button
        type="button"
        tabIndex={-1}
        aria-label={`${label} explanation`}
        className="cursor-help text-muted/60 transition-colors hover:text-ink focus:outline-none"
      >
        <InfoIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
      </button>
      <div className="pointer-events-none absolute left-0 top-full z-50 mt-2 hidden w-72 rounded-lg border border-hairline bg-ink p-2.5 text-xs leading-relaxed text-white shadow-2xl group-hover:block group-focus-within:block">
        <div className="absolute -top-1.5 left-3.5 h-3 w-3 rotate-45 border-l border-t border-hairline bg-ink" />
        <span className="relative z-10">{text}</span>
      </div>
    </div>
  );
}