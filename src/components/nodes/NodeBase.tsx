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
      style={{ width }}
      onDoubleClick={startEdit}
      onClick={() => setSelectedNode(id)}
    >
      {/* ── Inner visual card ─────────────────────────────────────────────── */}
      <div className="hlab-node-card" data-selected={selected || undefined}>

        {/* Header */}
        <div className="hlab-node-header">
          <div className="hlab-node-icon" style={{ color: iconColor }}>{icon}</div>
          <div className="hlab-node-info">
            {meta?.label && <div className="hlab-node-type">{meta.label}</div>}
            {editing ? (
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmEdit()
                  if (e.key === 'Escape') cancelEdit()
                }}
                className="hlab-node-edit-input nodrag"
              />
            ) : (
              <div className="hlab-node-label">{label}</div>
            )}
          </div>
          <div className="hlab-node-status" style={statusStyle} />
        </div>

        {/* Body / children */}
        {children}
      </div>

      {/* ── Action bar (hover) ────────────────────────────────────────────── */}
      {!editing && (
        <div className="group" style={{ position: 'absolute', top: 6, right: 6, zIndex: 20 }}>
          <div className="hlab-action-bar hlab-node-bar" style={{ opacity: 0 }}>
            <button
              title="Renommer"
              onClick={(e) => { e.stopPropagation(); startEdit() }}
              className="nodrag hlab-action-btn hlab-node-bar-btn"
              style={{ color: T.textDim }}
            >
              <Pencil size={9} />
            </button>
            <button
              title="Supprimer"
              onClick={(e) => { e.stopPropagation(); deleteNode(id) }}
              className="nodrag hlab-action-btn hlab-action-btn--danger hlab-node-bar-btn"
              style={{ color: T.textDim }}
            >
              <Trash2 size={9} />
            </button>
          </div>
        </div>
      )}

      {/* ── Edit confirm bar ──────────────────────────────────────────────── */}
      {editing && (
        <div className="hlab-node-bar">
          <button onClick={confirmEdit} className="nodrag hlab-node-bar-btn" style={{ color: '#3fb950' }}>
            <Check size={9} />
          </button>
          <button onClick={cancelEdit} className="nodrag hlab-node-bar-btn" style={{ color: '#f85149' }}>
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
