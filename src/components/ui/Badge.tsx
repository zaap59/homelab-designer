import { cn } from '@/utils/cn'

interface BadgeProps {
  children: React.ReactNode
  color?: string
  className?: string
}

export function Badge({ children, color = '#00e5ff', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-medium leading-none',
        className,
      )}
      style={{
        color,
        background: `${color}18`,
        border: `1px solid ${color}35`,
      }}
    >
      {children}
    </span>
  )
}
