import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg' | 'none'
}

export function Card({ className, hover, padding = 'md', children, ...props }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-[#2a2a38] bg-[#111117]',
        paddings[padding],
        hover && 'cursor-pointer transition-colors hover:border-green-500/40 hover:bg-[#1a1a22]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
