import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'normal'

// FEtask.sketch の実測値: ラベル付きボタン（Edit/New page/Done）は 90x40、
// 編集中の Cancel/Save は 40x40 の正方形
type ButtonWidth = 'wide' | 'square'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: ButtonVariant
  width?: ButtonWidth
  icon?: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-hover active:bg-brand-pressed',
  // secondary の枠線は 2px（FEtask.sketch の New page ボタン実測値）
  secondary:
    'bg-white text-brand border-2 border-brand hover:bg-secondary-hover active:bg-secondary-pressed',
  normal: 'bg-border-muted text-white hover:bg-normal-hover active:bg-normal-pressed',
}

const widthClasses: Record<ButtonWidth, string> = {
  wide: 'w-22.5',
  square: 'w-10',
}

export function Button({
  variant,
  width = 'wide',
  icon,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = [
    // design-7: 高さ40px / アイコン24px + ラベル10px（design-6 の minimum）
    'inline-flex h-10 flex-col items-center justify-center gap-0.5 rounded',
    widthClasses[width],
    'text-minimum leading-none font-medium transition-colors',
    'disabled:pointer-events-none disabled:opacity-25',
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
