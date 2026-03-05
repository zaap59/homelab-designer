import type { CSSProperties, ReactNode } from 'react'

// ─── Design tokens (mirrors tokens.css) ──────────────────────────────────────

export const T = {
  bg:           '#080c10',
  bg2:          '#0d1117',
  bg3:          '#131920',
  border:       '#1e2d3d',
  borderBright: '#2a4060',
  cyan:         '#00e5ff',
  green:        '#39ff14',
  amber:        '#ffaa00',
  red:          '#ff3860',
  purple:       '#a855f7',
  pink:         '#f472b6',
  blue:         '#60a5fa',
  text:         '#c9d1d9',
  textDim:      '#58677a',
  textBright:   '#e6edf3',
} as const

// ─── Tag variant styles ───────────────────────────────────────────────────────

export type TagVariant = 'cyan' | 'green' | 'amber' | 'purple' | 'pink' | 'blue'

const TAG_CSS: Record<TagVariant, CSSProperties> = {
  cyan:   { background: 'rgba(0,229,255,0.15)',   color: '#00e5ff', border: '1px solid rgba(0,229,255,0.2)' },
  green:  { background: 'rgba(57,255,20,0.12)',   color: '#39ff14', border: '1px solid rgba(57,255,20,0.2)' },
  amber:  { background: 'rgba(255,170,0,0.12)',   color: '#ffaa00', border: '1px solid rgba(255,170,0,0.2)' },
  purple: { background: 'rgba(168,85,247,0.10)',  color: '#a855f7', border: '1px solid rgba(168,85,247,0.25)' },
  pink:   { background: 'rgba(244,114,182,0.10)', color: '#f472b6', border: '1px solid rgba(244,114,182,0.25)' },
  blue:   { background: 'rgba(96,165,250,0.10)',  color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)' },
}

// ─── NodeField ────────────────────────────────────────────────────────────────

export function NodeField({
  label, value, valueColor,
}: { label: string; value?: string | null; valueColor?: string }) {
  if (!value) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <span style={{
        fontSize: 8, letterSpacing: '1.5px', textTransform: 'uppercase',
        color: T.textDim, lineHeight: 1,
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 11, color: valueColor ?? T.text, lineHeight: 1.4,
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        {value}
      </span>
    </div>
  )
}

// ─── NodeBody ─────────────────────────────────────────────────────────────────

export function NodeBody({ children }: { children: ReactNode }) {
  return (
    <div style={{
      padding: '8px 12px 10px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      {children}
    </div>
  )
}

// ─── NodeDivider ──────────────────────────────────────────────────────────────

export function NodeDivider() {
  return <div style={{ height: 1, background: T.border, margin: '4px 0' }} />
}

// ─── NodeTag ──────────────────────────────────────────────────────────────────

export function NodeTag({ children, variant }: { children: ReactNode; variant: TagVariant }) {
  return (
    <span style={{
      fontSize: 9, padding: '1px 6px', borderRadius: 3,
      letterSpacing: '0.5px', fontFamily: "'JetBrains Mono', monospace",
      ...TAG_CSS[variant],
    }}>
      {children}
    </span>
  )
}

// ─── NodeTags ─────────────────────────────────────────────────────────────────

export function NodeTags({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 2 }}>
      {children}
    </div>
  )
}

// ─── Status dot colors ────────────────────────────────────────────────────────

export const STATUS_STYLE: Record<string, CSSProperties> = {
  online:  { background: '#39ff14', boxShadow: '0 0 6px #39ff14' },
  offline: { background: '#444444' },
  warn:    { background: '#ffaa00', boxShadow: '0 0 6px #ffaa00' },
}
