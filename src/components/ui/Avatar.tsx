import { cn, getInitials } from '@/lib/utils'

interface AvatarProps {
  username: string
  avatarUrl?: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Avatar({ username, avatarUrl, size = 'md', className }: AvatarProps) {
  const sizes = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-xl',
  }

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={username}
        className={cn('rounded-full object-cover', sizes[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-700 font-bold text-white',
        sizes[size],
        className,
      )}
    >
      {getInitials(username)}
    </div>
  )
}
