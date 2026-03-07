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
  orange:       '#f97316',
  magenta:      '#e040fb',
  purple:       '#a855f7',
  pink:         '#f472b6',
  blue:         '#60a5fa',
  text:         '#c9d1d9',
  textDim:      '#58677a',
  textBright:   '#e6edf3',
} as const

// ─── Tag variant styles ───────────────────────────────────────────────────────

export type TagVariant = 'cyan' | 'green' | 'amber' | 'red' | 'orange' | 'purple' | 'pink' | 'blue'

const TAG_CSS: Record<TagVariant, CSSProperties> = {
  cyan:   { background: 'rgba(0,229,255,0.15)',   color: '#00e5ff', border: '1px solid rgba(0,229,255,0.2)' },
  green:  { background: 'rgba(57,255,20,0.12)',   color: '#39ff14', border: '1px solid rgba(57,255,20,0.2)' },
  amber:  { background: 'rgba(255,170,0,0.12)',   color: '#ffaa00', border: '1px solid rgba(255,170,0,0.2)' },
  red:    { background: 'rgba(255,56,96,0.12)',   color: '#ff3860', border: '1px solid rgba(255,56,96,0.2)' },
  orange: { background: 'rgba(249,115,22,0.12)',  color: '#f97316', border: '1px solid rgba(249,115,22,0.25)' },
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
    <div className="hlab-node-field">
      <span className="hlab-node-field-label">{label}</span>
      <span
        className="hlab-node-field-value"
        style={valueColor ? { '--field-color': valueColor } as CSSProperties : undefined}
      >
        {value}
      </span>
    </div>
  )
}

// ─── NodeBody ─────────────────────────────────────────────────────────────────

export function NodeBody({ children }: { children: ReactNode }) {
  return <div className="hlab-node-body">{children}</div>
}

// ─── NodeDivider ──────────────────────────────────────────────────────────────

export function NodeDivider() {
  return <div className="hlab-node-divider" />
}

// ─── NodeTag ──────────────────────────────────────────────────────────────────

export function NodeTag({ children, variant }: { children: ReactNode; variant: TagVariant }) {
  return (
    <span className="hlab-node-tag" style={TAG_CSS[variant]}>
      {children}
    </span>
  )
}

// ─── NodeTags ─────────────────────────────────────────────────────────────────

export function NodeTags({ children }: { children: ReactNode }) {
  return <div className="hlab-node-tags">{children}</div>
}

// ─── Status dot colors ────────────────────────────────────────────────────────

export const STATUS_STYLE: Record<string, CSSProperties> = {
  online:  { background: '#3fb950' },
  offline: { background: '#484f58' },
  warn:    { background: '#d29922' },
}
