import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, fullWidth, children, disabled, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0e] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95'

    const variants = {
      primary:
        'bg-green-500 hover:bg-green-400 text-white focus:ring-green-500 shadow-lg shadow-green-500/20',
      secondary:
        'bg-[#1a1a22] hover:bg-[#22222e] text-gray-100 border border-[#2a2a38] focus:ring-[#2a2a38]',
      ghost:
        'bg-transparent hover:bg-[#1a1a22] text-gray-300 focus:ring-[#2a2a38]',
      danger:
        'bg-red-600 hover:bg-red-500 text-white focus:ring-red-500',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
