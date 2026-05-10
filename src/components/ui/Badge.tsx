import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'green' | 'red' | 'yellow' | 'blue' | 'gray'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  const variants = {
    default: 'bg-[#22222e] text-gray-300 border border-[#2a2a38]',
    green:   'bg-green-500/15 text-green-400 border border-green-500/30',
    red:     'bg-red-500/15 text-red-400 border border-red-500/30',
    yellow:  'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
    blue:    'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    gray:    'bg-gray-700/50 text-gray-400 border border-gray-700',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </span>
  )
}
