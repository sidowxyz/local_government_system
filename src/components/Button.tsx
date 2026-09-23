import type React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-white hover:bg-primaryHover active:scale-[0.98] shadow-sm hover:shadow-md font-semibold border border-transparent',
  secondary:
    'border border-hairline bg-white text-ink hover:border-primary/40 hover:bg-surface hover:text-primary active:scale-[0.98] font-medium shadow-card',
  ghost: 'text-muted hover:bg-surface hover:text-ink active:scale-[0.98] font-medium'
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-body transition-all duration-150 ease-standard',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
        variants[variant],
        className
      ].join(' ')}
      {...rest}
    />
  );
}