import { useState, useEffect } from 'react'
import { useStore } from '@/store/useStore'
import type { EdgeType, HLabEdgeData } from '@/types'
import { EDGE_META } from '@/types'

export function EdgeEditModal() {
  const [editingId, setEditingId] = useState<string | null>(null)
  const edges          = useStore((s) => s.edges)
  const updateEdgeData = useStore((s) => s.updateEdgeData)
  const deleteEdge     = useStore((s) => s.deleteEdge)

  useEffect(() => {
    const h = (e: Event) => setEditingId((e as CustomEvent<{ id: string }>).detail.id)
    window.addEventListener('hlab:edit-edge', h)
    return () => window.removeEventListener('hlab:edit-edge', h)
  }, [])

  if (!editingId) return null
  const edge = edges.find((e) => e.id === editingId)
  if (!edge) { setEditingId(null); return null }

  const data: HLabEdgeData = edge.data ?? { edgeType: 'ethernet' }
  const upd = (patch: Partial<HLabEdgeData>) => updateEdgeData(editingId, patch)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={() => setEditingId(null)}
    >
      <div
        className="flex flex-col gap-3 p-4 rounded-lg"
        style={{ background: '#161b22', border: '1px solid #30363d', width: 280, fontFamily: '"JetBrains Mono", monospace' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span style={{ fontSize: 11, color: '#e6edf3', fontWeight: 600 }}>Edit Connection</span>
          <button onClick={() => setEditingId(null)} style={{ color: '#484f58', fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>

        {/* Type selector */}
        <div className="flex flex-col gap-1">
          <label style={{ fontSize: 9, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Type</label>
          <div className="flex gap-1.5 flex-wrap">
            {(Object.keys(EDGE_META) as EdgeType[]).map((t) => {
              const m = EDGE_META[t]
              const active = (data.edgeType ?? 'ethernet') === t
              return (
                <button key={t} onClick={() => upd({ edgeType: t })} style={{
                  fontSize: 9, padding: '3px 8px', borderRadius: 4, cursor: 'pointer',
                  border: `1px solid ${active ? m.color : '#30363d'}`,
                  background: active ? `${m.color}18` : 'transparent',
                  color: active ? m.color : '#8b949e',
                }}>{m.label}</button>
              )
            })}
          </div>
        </div>

        <MiniField label="Label"     value={data.label      ?? ''} placeholder="e.g. WAN, trunk"    onChange={(v) => upd({ label: v })} />
        <MiniField label="Bandwidth" value={data.bandwidth  ?? ''} placeholder="e.g. 1 Gbps"        onChange={(v) => upd({ bandwidth: v })} />
        <MiniField label="Protocol"  value={data.protocol   ?? ''} placeholder="e.g. OSPF, BGP"     onChange={(v) => upd({ protocol: v })} />

        <div className="flex items-center gap-2">
          <input type="checkbox" id="directed" checked={data.directed ?? false}
            onChange={(e) => upd({ directed: e.target.checked })}
            style={{ cursor: 'pointer', accentColor: '#00e5ff' }}
          />
          <label htmlFor="directed" style={{ fontSize: 10, color: '#8b949e', cursor: 'pointer' }}>Directional arrow</label>
        </div>

        <div className="flex justify-between pt-1 border-t" style={{ borderColor: '#21262d' }}>
          <button onClick={() => { deleteEdge(editingId); setEditingId(null) }}
            style={{ fontSize: 9, padding: '4px 10px', borderRadius: 4, cursor: 'pointer', border: '1px solid #f85149', color: '#f85149', background: 'transparent' }}>
            Delete
          </button>
          <button onClick={() => setEditingId(null)}
            style={{ fontSize: 9, padding: '4px 10px', borderRadius: 4, cursor: 'pointer', border: '1px solid #00e5ff', color: '#00e5ff', background: '#00e5ff18' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

function MiniField({ label, value, placeholder, onChange }: { label: string; value: string; placeholder: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-0.5">
      <label style={{ fontSize: 9, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
      <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: 4, color: '#e6edf3', fontSize: 10, padding: '4px 8px', outline: 'none', fontFamily: '"JetBrains Mono", monospace' }}
      />
    </div>
  )
}
