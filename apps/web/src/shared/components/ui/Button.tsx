import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'ghost'
  | 'outline'
type ButtonSize = 'default' | 'small' | 'large' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  children: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  default: 'bg-zinc-900 text-white border border-zinc-900',
  secondary: 'bg-zinc-100 text-zinc-900 border border-zinc-200',
  destructive: 'bg-red-500 text-white border border-red-500',
  ghost: 'bg-transparent text-zinc-900 border border-transparent',
  outline: 'bg-transparent text-zinc-900 border border-zinc-200',
}

const sizeClasses: Record<ButtonSize, string> = {
  default: 'px-4 py-2 text-sm',
  small: 'px-2 py-1 text-xs',
  large: 'px-6 py-3 text-base',
  icon: 'p-2 text-sm',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'default',
      loading = false,
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading
    const buttonClassName = [
      'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400',
      variantClasses[variant],
      sizeClasses[size],
      isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={buttonClassName}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

// IconButton is a variant of Button for icon-only buttons
export const IconButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'size'> & { size?: 'small' | 'default' | 'large' }
>(({ variant = 'ghost', size = 'default', ...props }, ref) => {
  return <Button ref={ref} variant={variant} size="icon" {...props} />
})

IconButton.displayName = 'IconButton'
