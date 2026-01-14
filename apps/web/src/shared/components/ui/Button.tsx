import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'default' | 'secondary' | 'destructive' | 'ghost' | 'outline'
type ButtonSize = 'default' | 'small' | 'large' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  children: ReactNode
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  default: {
    backgroundColor: '#18181b',
    color: 'white',
    border: '1px solid #18181b',
  },
  secondary: {
    backgroundColor: '#f4f4f5',
    color: '#18181b',
    border: '1px solid #e4e4e7',
  },
  destructive: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: '1px solid #ef4444',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: '#18181b',
    border: '1px solid transparent',
  },
  outline: {
    backgroundColor: 'transparent',
    color: '#18181b',
    border: '1px solid #e4e4e7',
  },
}

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  default: {
    padding: '8px 16px',
    fontSize: '14px',
  },
  small: {
    padding: '4px 8px',
    fontSize: '12px',
  },
  large: {
    padding: '12px 24px',
    fontSize: '16px',
  },
  icon: {
    padding: '8px',
    fontSize: '14px',
  },
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'default',
      loading = false,
      disabled,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          borderRadius: '6px',
          fontWeight: 500,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.5 : 1,
          transition: 'background-color 0.15s, opacity 0.15s',
          ...variantStyles[variant],
          ...sizeStyles[size],
          ...style,
        }}
        {...props}
      >
        {loading && (
          <svg
            style={{
              width: '16px',
              height: '16px',
              animation: 'spin 1s linear infinite',
            }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              style={{ opacity: 0.25 }}
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              style={{ opacity: 0.75 }}
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
