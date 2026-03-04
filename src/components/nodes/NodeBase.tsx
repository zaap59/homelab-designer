import { memo, useState, useCallback } from 'react'
import { Handle, Position } from '@xyflow/react'
import { Trash2, Pencil, Check, X } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useStore } from '@/store/useStore'
import { NODE_META } from '@/types'
import type { NodeType } from '@/types'

export interface NodeBadge {
  label: string
  value: string
  color?: string
}

export interface NodeBaseProps {
  id: string
  nodeType: NodeType
  label: string
  selected?: boolean
  icon: React.ReactNode
  badges?: NodeBadge[]
  children?: React.ReactNode
  minWidth?: number
}

export const NodeBase = memo(function NodeBase({
  id,
  nodeType,
  label,
  selected,
  icon,
  badges = [],
  children,
  minWidth = 160,
}: NodeBaseProps) {
  const meta = NODE_META[nodeType]
  const color = meta.color

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(label)
  const updateNodeData = useStore((s) => s.updateNodeData)
  const deleteNode = useStore((s) => s.deleteNode)
  const setSelectedNode = useStore((s) => s.setSelectedNode)

  const startEdit = useCallback(() => {
    setDraft(label)
    setEditing(true)
  }, [label])

  const confirmEdit = useCallback(() => {
    if (draft.trim()) updateNodeData(id, { label: draft.trim() })
    setEditing(false)
  }, [draft, id, updateNodeData])

  const cancelEdit = useCallback(() => {
    setDraft(label)
    setEditing(false)
  }, [label])

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
      {/* Color strip */}
      <div className="h-[3px] rounded-t-[7px]" style={{ background: color }} />

      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2">
        <div
          className="flex items-center justify-center w-7 h-7 rounded-md shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}35` }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
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
            <span className="block truncate text-[11px] font-semibold text-[#e6edf3] max-w-[130px]">
              {label}
            </span>
          )}
          <span className="block text-[9px] text-[#484f58] uppercase tracking-wider mt-0.5">
            {meta.label}
          </span>
        </div>
      </div>

      {/* Badges row */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-1 px-3 pb-2 -mt-0.5">
          {badges.map((b) => (
            <span
              key={b.label}
              className="inline-flex items-center gap-0.5 text-[9px] font-mono"
              style={{ color: b.color ?? '#8b949e' }}
            >
              <span className="text-[#484f58]">{b.label}:</span>
              <span style={{ color: b.color ?? '#c9d1d9' }}>{b.value}</span>
            </span>
          ))}
        </div>
      )}

      {/* Extra content slot */}
      {children && (
        <div className="border-t border-[#21262d] px-3 py-2">{children}</div>
      )}

      {/* Action bar — shown on hover/select, inside node top-right corner */}
      {!editing && (
        <div className="absolute top-1.5 right-1.5 hidden group-hover:flex items-center gap-0.5
          bg-[#1c2128] border border-[#30363d] rounded px-1 py-0.5 z-20 shadow-md">
          <button
            title="Renommer"
            onClick={(e) => { e.stopPropagation(); startEdit() }}
            className="flex items-center justify-center w-5 h-5 rounded text-[#8b949e] hover:text-[#00e5ff] hover:bg-[#00e5ff14] transition-colors nodrag"
          >
            <Pencil size={10} />
          </button>
          <button
            title="Supprimer"
            onClick={(e) => { e.stopPropagation(); deleteNode(id) }}
            className="flex items-center justify-center w-5 h-5 rounded text-[#8b949e] hover:text-[#f85149] hover:bg-[#f8514914] transition-colors nodrag"
          >
            <Trash2 size={10} />
          </button>
        </div>
      )}

      {/* Edit confirm bar */}
      {editing && (
        <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5
          bg-[#1c2128] border border-[#30363d] rounded px-1 py-0.5 z-20">
          <button onClick={confirmEdit} className="flex items-center justify-center w-5 h-5 rounded text-[#3fb950] hover:bg-[#3fb95014] nodrag">
            <Check size={10} />
          </button>
          <button onClick={cancelEdit} className="flex items-center justify-center w-5 h-5 rounded text-[#f85149] hover:bg-[#f8514914] nodrag">
            <X size={10} />
          </button>
        </div>
      )}

      {/* Handles */}
      <Handle type="target" position={Position.Top}    id="top"    className="!-top-[5px]" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!-bottom-[5px]" />
      <Handle type="source" position={Position.Right}  id="right"  className="!-right-[5px]" />
      <Handle type="target" position={Position.Left}   id="left"   className="!-left-[5px]" />
    </div>
  )
})
