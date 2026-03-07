import { memo, useState, useRef } from 'react'
import { NodeResizer, type NodeProps, type Node } from '@xyflow/react'
import type { GroupData } from '@/types'
import { useStore } from '@/store/useStore'
import { T } from './shared'

const PALETTE = ['#30363d', '#ff6b3540', '#7c4dff40', '#00e67640', '#40c4ff40', '#e040fb40', '#ffd74040']

export const GroupNode = memo(function GroupNode({ id, data, selected }: NodeProps<Node<GroupData>>) {
  const updateNodeData  = useStore((s) => s.updateNodeData)
  const deleteNode      = useStore((s) => s.deleteNode)
  const setSelectedNode = useStore((s) => s.setSelectedNode)
  const [editingLabel, setEditingLabel] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const color = data.color ?? '#30363d'
  const borderColor = color === '#30363d' ? '#484f58' : color

  return (
    <>
      <NodeResizer minWidth={120} minHeight={80} isVisible={selected}
        lineStyle={{ border: '1px dashed #484f58' }}
        handleStyle={{ background: '#484f58', border: 'none', width: 8, height: 8 }}
      />
      <div
        style={{
          width: '100%', height: '100%', borderRadius: 8, position: 'relative',
          userSelect: 'none', border: `1px dashed ${borderColor}`,
          background: color === '#30363d' ? '#ffffff08' : color,
          minWidth: 120, minHeight: 80,
        }}
        onClick={() => setSelectedNode(id)}
      >
        {/* Top-right: color palette + delete button */}
        {selected && (
          <div style={{ position: 'absolute', top: 4, right: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            {PALETTE.map((c) => (
              <button key={c}
                onClick={(e) => { e.stopPropagation(); updateNodeData(id, { color: c }) }}
                style={{ width: 8, height: 8, borderRadius: '50%', background: c, border: color === c ? '1px solid #fff' : '1px solid #30363d', cursor: 'pointer', padding: 0, flexShrink: 0 }} />
            ))}
            <button
              title="Supprimer le groupe"
              onClick={(e) => { e.stopPropagation(); deleteNode(id) }}
              style={{
                marginLeft: 3,
                width: 14, height: 14, borderRadius: 3,
                background: `${T.red}20`, border: `1px solid ${T.red}60`,
                color: T.red, cursor: 'pointer', padding: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, lineHeight: 1, flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Label */}
        <div style={{ position: 'absolute', top: 4, left: 8 }}>
          {editingLabel ? (
            <input ref={inputRef} autoFocus defaultValue={data.label}
              onBlur={(e) => { updateNodeData(id, { label: e.target.value || 'Group' }); setEditingLabel(false) }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') inputRef.current?.blur() }}
              style={{ background: 'transparent', border: 'none', outline: 'none', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.text, width: 100 }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.text, cursor: 'text' }}
              onDoubleClick={(e) => { e.stopPropagation(); setEditingLabel(true) }}
            >
              {data.label}
            </span>
          )}
        </div>
      </div>
    </>
  )
})
