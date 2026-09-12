import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'normal'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: ButtonVariant
  icon?: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-hover active:bg-brand-pressed',
  secondary:
    'bg-white text-brand border border-brand hover:bg-secondary-hover active:bg-secondary-pressed',
  normal: 'bg-border-muted text-white hover:bg-normal-hover active:bg-normal-pressed',
}

export function Button({ variant, icon, className, children, ...props }: ButtonProps) {
  const classes = [
    'inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded px-4',
    'font-medium transition-colors disabled:pointer-events-none disabled:opacity-25',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} {...props}>
      {icon}
      {children}
    </button>
  )
}
