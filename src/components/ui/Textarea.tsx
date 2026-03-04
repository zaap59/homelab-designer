import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, className, ...props }, ref) => (
    <div className="flex flex-col gap-0.5">
      {label && (
        <label className="text-[11px] uppercase tracking-widest text-[#484f58] font-semibold">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={2}
        className={cn(
          'w-full bg-[#0d1117] border border-[#30363d] rounded px-2.5 py-2 resize-none',
          'text-[12px] text-[#c9d1d9] outline-none placeholder:text-[#484f58]',
          'focus:border-[#00e5ff] focus:text-[#e6edf3] transition-colors',
          className,
        )}
        style={{ fontFamily: '"JetBrains Mono", monospace' }}
        {...props}
      />
    </div>
  ),
)
Textarea.displayName = 'Textarea'
