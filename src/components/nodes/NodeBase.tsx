import { memo, useState, useCallback } from 'react'
import { Handle, Position } from '@xyflow/react'
import { Trash2, Pencil, Check, X } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { NODE_META } from '@/types'
import type { NodeType } from '@/types'
import { T, STATUS_STYLE } from './shared'

// ─── Re-export primitives for node components ─────────────────────────────────
export { NodeField, NodeBody, NodeDivider, NodeTag, NodeTags, T } from './shared'
export type { TagVariant } from './shared'

// ─── NodeBaseProps ────────────────────────────────────────────────────────────

export interface NodeBaseProps {
  id: string
  nodeType: NodeType
  label: string
  selected?: boolean
  /** SVG icon element */
  icon: React.ReactNode
  /** Stroke/fill color of the icon */
  iconColor: string
  /** Status dot variant */
  status?: 'online' | 'offline' | 'warn'
  /** Node width in px */
  width?: number
  /** Extra top border color (e.g. purple for Container) */
  borderTopColor?: string
  /** Body + port section content */
  children?: React.ReactNode
  /** Custom handles rendered outside the inner visual div (direct children of root) */
  handles?: React.ReactNode
  /** When true, no default 4 handles are rendered */
  customHandles?: boolean
}

// ─── NodeBase ─────────────────────────────────────────────────────────────────

export const NodeBase = memo(function NodeBase({
  id,
  nodeType,
  label,
  selected,
  icon,
  iconColor,
  status = 'online',
  width = 221,
  borderTopColor,
  children,
  handles,
  customHandles = false,
}: NodeBaseProps) {
  const meta = NODE_META[nodeType]

  const [editing, setEditing]   = useState(false)
  const [draft, setDraft]       = useState(label)
  const updateNodeData          = useStore((s) => s.updateNodeData)
  const deleteNode              = useStore((s) => s.deleteNode)
  const setSelectedNode         = useStore((s) => s.setSelectedNode)

  const startEdit   = useCallback(() => { setDraft(label); setEditing(true) }, [label])
  const confirmEdit = useCallback(() => {
    if (draft.trim()) updateNodeData(id, { label: draft.trim() })
    setEditing(false)
  }, [draft, id, updateNodeData])
  const cancelEdit  = useCallback(() => { setDraft(label); setEditing(false) }, [label])

  const statusStyle = STATUS_STYLE[status] ?? STATUS_STYLE.online

  return (
    <div
      className="hlab-node hlab-node-enter"
      style={{
        position: 'relative',
        overflow: 'visible',
        width,
        fontFamily: "'JetBrains Mono', monospace",
        cursor: 'pointer',
      }}
      onDoubleClick={startEdit}
      onClick={() => setSelectedNode(id)}
    >
      {/* ── Inner visual card (border + bg live here, NOT on root) ─────────── */}
      <div style={{
        borderRadius: 6,
        border: `1px solid ${selected ? T.cyan : T.border}`,
        background: T.bg2,
        overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: selected
          ? `0 0 0 1px ${T.cyan}, 0 0 20px rgba(0,229,255,0.4), 0 8px 32px rgba(0,0,0,0.5)`
          : undefined,
      }}>
      {/* ── Accent strip ────────────────────────────────────────────────────── */}
      <div style={{
        height: 3,
        background: borderTopColor ?? iconColor,
        opacity: selected ? 1 : 0.75,
        transition: 'opacity 0.2s',
      }} />
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 12px 8px',
        borderBottom: `1px solid ${T.border}`,
      }}>
        {/* 22×22 icon */}
        <div style={{
          width: 22, height: 22, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: iconColor,
        }}>
          {icon}
        </div>

        {/* Type + name */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {meta?.label && (
            <div style={{
              fontSize: 8, letterSpacing: '2px', textTransform: 'uppercase',
              color: T.textDim, lineHeight: 1, marginBottom: 2,
            }}>
              {meta.label}
            </div>
          )}
          {editing ? (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmEdit()
                if (e.key === 'Escape') cancelEdit()
              }}
              style={{
                width: '100%', background: T.bg3, border: `1px solid ${T.cyan}`,
                borderRadius: 3, padding: '1px 4px', fontSize: 11,
                color: T.textBright, outline: 'none', fontFamily: 'inherit',
              }}
              className="nodrag"
            />
          ) : (
            <div style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 14, fontWeight: 600, color: T.textBright,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              lineHeight: 1.2,
            }}>
              {label}
            </div>
          )}
        </div>

        {/* Status dot */}
        <div style={{
          width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
          ...statusStyle,
        }} />
      </div>

      {/* ── Body / children ────────────────────────────────────────────────── */}
      {children}

      </div>{/* end inner visual card */}

      {/* ── Action bar (hover) — anchored to root div ──────────────────────── */}
      {!editing && (
        <div className="group" style={{ position: 'absolute', top: 6, right: 6, zIndex: 20 }}>
          <div className="hlab-action-bar" style={{
            display: 'flex', alignItems: 'center', gap: 2,
            background: T.bg3, border: `1px solid ${T.border}`,
            borderRadius: 4, padding: '2px 4px', opacity: 0,
          }}>
            <button
              title="Renommer"
              onClick={(e) => { e.stopPropagation(); startEdit() }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 18, height: 18, borderRadius: 3, border: 'none',
                background: 'transparent', color: T.textDim, cursor: 'pointer',
              }}
              className="nodrag hlab-action-btn"
            >
              <Pencil size={9} />
            </button>
            <button
              title="Supprimer"
              onClick={(e) => { e.stopPropagation(); deleteNode(id) }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 18, height: 18, borderRadius: 3, border: 'none',
                background: 'transparent', color: T.textDim, cursor: 'pointer',
              }}
              className="nodrag hlab-action-btn hlab-action-btn--danger"
            >
              <Trash2 size={9} />
            </button>
          </div>
        </div>
      )}

      {/* ── Edit confirm bar ──────────────────────────────────────────────── */}
      {editing && (
        <div style={{
          position: 'absolute', top: 6, right: 6, zIndex: 20,
          display: 'flex', alignItems: 'center', gap: 2,
          background: T.bg3, border: `1px solid ${T.border}`,
          borderRadius: 4, padding: '2px 4px',
        }}>
          <button onClick={confirmEdit} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 18, height: 18, borderRadius: 3, border: 'none',
            background: 'transparent', color: '#3fb950', cursor: 'pointer',
          }} className="nodrag">
            <Check size={9} />
          </button>
          <button onClick={cancelEdit} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 18, height: 18, borderRadius: 3, border: 'none',
            background: 'transparent', color: '#f85149', cursor: 'pointer',
          }} className="nodrag">
            <X size={9} />
          </button>
        </div>
      )}

      {/* ── Custom handles (passed via prop) ─────────────────────────────── */}
      {handles}

      {/* ── Default 4 handles ─────────────────────────────────────────────── */}
      {!customHandles && (
        <>
          <Handle type="target" position={Position.Top}    id="top" />
          <Handle type="source" position={Position.Bottom} id="bottom" />
          <Handle type="source" position={Position.Right}  id="right" />
          <Handle type="target" position={Position.Left}   id="left" />
        </>
      )}
    </div>
  )
})
