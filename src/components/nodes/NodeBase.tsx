import { memo, useState, useCallback } from 'react'
import { Handle, Position } from '@xyflow/react'
import { Trash2, Pencil, Check, X } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useStore } from '@/store/useStore'
import { NODE_META } from '@/types'
import type { NodeType } from '@/types'

// ─── NodeField sub-component ──────────────────────────────────────────────────

export interface NodeFieldDef {
  label: string
  value: string
  color?: string
}

function NodeField({ label, value, color }: NodeFieldDef) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[8px] uppercase tracking-widest text-[#484f58]">
        {label}
      </span>
      <span
        className="text-[11px] font-mono truncate"
        style={{ color: color ?? '#c9d1d9' }}
      >
        {value}
      </span>
    </div>
  )
}

// ─── NodeBaseProps ────────────────────────────────────────────────────────────

export interface NodeBaseProps {
  id: string
  nodeType: NodeType
  label: string
  selected?: boolean
  icon: React.ReactNode
  /** Vertical stacked fields (label above, value below) */
  fields?: NodeFieldDef[]
  /** Tag chips at the bottom */
  tags?: string[]
  children?: React.ReactNode
  minWidth?: number
  /** When true, no default 4 handles are rendered — node manages its own */
  customHandles?: boolean
}

// ─── NodeBase ─────────────────────────────────────────────────────────────────

export const NodeBase = memo(function NodeBase({
  id,
  nodeType,
  label,
  selected,
  icon,
  fields = [],
  tags = [],
  children,
  minWidth = 160,
  customHandles = false,
}: NodeBaseProps) {
  const meta  = NODE_META[nodeType]
  const color = meta.color

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(label)
  const updateNodeData  = useStore((s) => s.updateNodeData)
  const deleteNode      = useStore((s) => s.deleteNode)
  const setSelectedNode = useStore((s) => s.setSelectedNode)

  const startEdit = useCallback(() => { setDraft(label); setEditing(true) }, [label])

  const confirmEdit = useCallback(() => {
    if (draft.trim()) updateNodeData(id, { label: draft.trim() })
    setEditing(false)
  }, [draft, id, updateNodeData])

  const cancelEdit = useCallback(() => { setDraft(label); setEditing(false) }, [label])

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-lg border transition-all duration-150 group hlab-node-enter',
        'bg-[#161b22]',
        selected
          ? 'border-[#00e5ff] shadow-[0_0_0_1px_#00e5ff,0_0_24px_rgba(0,229,255,0.18)]'
          : 'border-[#30363d] hover:border-[#484f58]',
      )}
      style={{ minWidth, fontFamily: '"JetBrains Mono", monospace' }}
      onDoubleClick={startEdit}
      onClick={() => setSelectedNode(id)}
    >
      {/* ── Top color strip ────────────────────────────────────────────────── */}
      <div className="h-[3px] rounded-t-[7px]" style={{ background: color }} />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-3 pt-2 pb-1.5">
        {/* Icon box */}
        <div
          className="flex items-center justify-center w-7 h-7 rounded-md shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}35` }}
        >
          {icon}
        </div>

        {/* Type label + node name */}
        <div className="flex-1 min-w-0">
          <span
            className="block text-[8px] uppercase tracking-widest font-semibold mb-0.5"
            style={{ color: `${color}cc` }}
          >
            {meta.label}
          </span>
          {editing ? (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmEdit()
                if (e.key === 'Escape') cancelEdit()
              }}
              className="w-full bg-[#0d1117] border border-[#00e5ff] rounded px-1 py-0.5
                text-[11px] text-[#e6edf3] outline-none nodrag"
              style={{ fontFamily: 'inherit' }}
            />
          ) : (
            <span className="block truncate text-[12px] font-semibold text-[#e6edf3]">
              {label}
            </span>
          )}
        </div>

        {/* Status dot */}
        <div
          className="w-2 h-2 rounded-full shrink-0 mt-0.5"
          style={{ background: color, boxShadow: `0 0 5px ${color}80` }}
        />
      </div>

      {/* ── Vertical fields section ────────────────────────────────────────── */}
      {fields.length > 0 && (
        <>
          <div className="mx-3 border-t border-[#21262d]" />
          <div className="px-3 py-2 space-y-2">
            {fields.map((f) => (
              <NodeField key={f.label} {...f} />
            ))}
          </div>
        </>
      )}

      {/* ── Tag chips ──────────────────────────────────────────────────────── */}
      {tags.length > 0 && (
        <>
          <div className="mx-3 border-t border-[#21262d]" />
          <div className="flex flex-wrap gap-1 px-3 py-2">
            {tags.map((t) => (
              <span
                key={t}
                className="text-[8px] px-1.5 py-0.5 rounded border"
                style={{ borderColor: `${color}40`, color, background: `${color}12` }}
              >
                {t}
              </span>
            ))}
          </div>
        </>
      )}

      {/* ── Extra children slot (port grid, etc.) ─────────────────────────── */}
      {children && (
        <div className="border-t border-[#21262d]">{children}</div>
      )}

      {/* ── Action bar ────────────────────────────────────────────────────── */}
      {!editing && (
        <div className="absolute top-1.5 right-1.5 hidden group-hover:flex items-center gap-0.5
          bg-[#1c2128] border border-[#30363d] rounded px-1 py-0.5 z-20 shadow-md">
          <button
            title="Renommer"
            onClick={(e) => { e.stopPropagation(); startEdit() }}
            className="flex items-center justify-center w-5 h-5 rounded text-[#8b949e]
              hover:text-[#00e5ff] hover:bg-[#00e5ff14] transition-colors nodrag"
          >
            <Pencil size={10} />
          </button>
          <button
            title="Supprimer"
            onClick={(e) => { e.stopPropagation(); deleteNode(id) }}
            className="flex items-center justify-center w-5 h-5 rounded text-[#8b949e]
              hover:text-[#f85149] hover:bg-[#f8514914] transition-colors nodrag"
          >
            <Trash2 size={10} />
          </button>
        </div>
      )}

      {/* ── Edit confirm bar ──────────────────────────────────────────────── */}
      {editing && (
        <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5
          bg-[#1c2128] border border-[#30363d] rounded px-1 py-0.5 z-20">
          <button onClick={confirmEdit}
            className="flex items-center justify-center w-5 h-5 rounded text-[#3fb950] hover:bg-[#3fb95014] nodrag">
            <Check size={10} />
          </button>
          <button onClick={cancelEdit}
            className="flex items-center justify-center w-5 h-5 rounded text-[#f85149] hover:bg-[#f8514914] nodrag">
            <X size={10} />
          </button>
        </div>
      )}

      {/* ── Default 4 handles ─────────────────────────────────────────────── */}
      {!customHandles && (
        <>
          <Handle type="target" position={Position.Top}    id="top"    className="!-top-[5px]" />
          <Handle type="source" position={Position.Bottom} id="bottom" className="!-bottom-[5px]" />
          <Handle type="source" position={Position.Right}  id="right"  className="!-right-[5px]" />
          <Handle type="target" position={Position.Left}   id="left"   className="!-left-[5px]" />
        </>
      )}
    </div>
  )
})
