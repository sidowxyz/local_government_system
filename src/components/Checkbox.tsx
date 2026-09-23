import React from 'react';
import { TickIcon } from './icons';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked = false,
      indeterminate = false,
      disabled = false,
      onChange,
      label,
      description,
      className = '',
      id,
      size = 'md',
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `cb-${Math.random().toString(36).substring(2, 9)}` : undefined);

    const checkboxBox = (
      <div
        className={[
          'relative flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-all duration-150 ease-standard',
          disabled
            ? 'cursor-not-allowed bg-surface/70 border-hairline text-muted/40'
            : checked || indeterminate
            ? 'border-primary bg-primary text-white shadow-xs'
            : 'border-hairline bg-white hover:border-primary/60 group-hover:border-primary/60',
        ].join(' ')}
      >
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          {...props}
        />
        {indeterminate ? (
          <span className="h-0.5 w-2.5 rounded-full bg-white" />
        ) : checked ? (
          <TickIcon
            className="h-3 w-3 stroke-[2.5] text-white"
          />
        ) : null}
      </div>
    );

    if (!label && !description) {
      return (
        <label
          className={`group relative inline-flex items-center justify-center ${
            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          } ${className}`}
        >
          {checkboxBox}
        </label>
      );
    }

    return (
      <label
        htmlFor={inputId}
        className={`group flex items-start gap-3 ${
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
        } ${className}`}
      >
        <div className="pt-0.5">{checkboxBox}</div>
        <div className="min-w-0 flex-1 select-none">
          {label && (
            <div
              className={`text-body font-medium transition-colors ${
                checked ? 'text-ink' : 'text-ink/90 group-hover:text-ink'
              }`}
            >
              {label}
            </div>
          )}
          {description && (
            <div className="mt-0.5 text-meta text-muted leading-normal">
              {description}
            </div>
          )}
        </div>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
