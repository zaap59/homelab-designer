import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, ...props }, ref) => (
    <div className="flex flex-col gap-0.5">
      {label && (
        <label className="text-[9px] uppercase tracking-widest text-[#484f58] font-semibold">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full bg-[#0d1117] border border-[#30363d] rounded px-2 py-1.5',
          'text-[11px] text-[#c9d1d9] outline-none placeholder:text-[#484f58]',
          'focus:border-[#00e5ff] focus:text-[#e6edf3] transition-colors',
          className,
        )}
        style={{ fontFamily: '"JetBrains Mono", monospace' }}
        {...props}
      />
    </div>
  ),
)
Input.displayName = 'Input'
