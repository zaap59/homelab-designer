import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, className, ...props }, ref) => (
    <div className="flex flex-col gap-0.5">
      {label && (
        <label className="text-[9px] uppercase tracking-widest text-[#484f58] font-semibold">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          'w-full bg-[#0d1117] border border-[#30363d] rounded px-2 py-1.5',
          'text-[11px] text-[#c9d1d9] outline-none appearance-none cursor-pointer',
          'focus:border-[#00e5ff] transition-colors',
          className,
        )}
        style={{ fontFamily: '"JetBrains Mono", monospace' }}
        {...props}
      >
        <option value="">—</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  ),
)
Select.displayName = 'Select'
