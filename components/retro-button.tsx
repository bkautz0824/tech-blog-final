import { cn } from '@/lib/utils'

interface RetroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
}

export function RetroButton({
  variant = 'primary',
  className,
  children,
  ...props
}: RetroButtonProps) {
  return (
    <button
      className={cn(
        'retro-button',
        variant === 'secondary' && 'retro-button-secondary',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}