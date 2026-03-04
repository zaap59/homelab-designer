import { useToasts } from '@/lib/toast'
import type { ToastType } from '@/lib/toast'
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2  size={14} className="text-[#3fb950] shrink-0" />,
  error:   <AlertCircle   size={14} className="text-[#f85149] shrink-0" />,
  info:    <Info          size={14} className="text-[#00e5ff] shrink-0" />,
  warning: <AlertTriangle size={14} className="text-[#d29922] shrink-0" />,
}

const COLORS: Record<ToastType, { border: string; bg: string }> = {
  success: { border: '#3fb950', bg: '#3fb95012' },
  error:   { border: '#f85149', bg: '#f8514912' },
  info:    { border: '#00e5ff', bg: '#00e5ff12' },
  warning: { border: '#d29922', bg: '#d2992212' },
}

export function ToastContainer() {
  const toasts = useToasts()

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => {
        const c = COLORS[t.type]
        return (
          <div
            key={t.id}
            className="hlab-toast-enter"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              borderRadius: 8,
              border: `1px solid ${c.border}40`,
              background: `#161b22`,
              boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px ${c.border}22`,
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 12,
              color: '#e6edf3',
              pointerEvents: 'auto',
              minWidth: 240,
              maxWidth: 360,
              backdropFilter: 'blur(8px)',
            }}
          >
            {ICONS[t.type]}
            <span style={{ flex: 1, lineHeight: 1.4 }}>{t.message}</span>
            <X size={11} style={{ color: '#484f58', cursor: 'pointer', flexShrink: 0 }} />
          </div>
        )
      })}
    </div>
  )
}
