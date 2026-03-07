import { X, Link2 } from 'lucide-react'
import { useStore } from '@/store/useStore'
import type { EdgeType, HLabEdgeData } from '@/types'
import { EDGE_META } from '@/types'
import { Input } from '@/components/ui/Input'
import { Separator } from '@/components/ui/Separator'

export function EdgePropertiesPanel() {
  const edges           = useStore((s) => s.edges)
  const selectedEdgeId  = useStore((s) => s.selectedEdgeId)
  const setSelectedEdge = useStore((s) => s.setSelectedEdge)
  const updateEdgeData  = useStore((s) => s.updateEdgeData)
  const deleteEdge      = useStore((s) => s.deleteEdge)

  if (!selectedEdgeId) return null
  const edge = edges.find((e) => e.id === selectedEdgeId)
  if (!edge) return null

  const data: HLabEdgeData = edge.data ?? { edgeType: 'ethernet' }
  const meta = EDGE_META[data.edgeType ?? 'ethernet']
  const upd  = (patch: Partial<HLabEdgeData>) => updateEdgeData(selectedEdgeId, patch)

  return (
    <aside style={{
      display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto',
      width: 260, background: '#0d1117',
      borderLeft: '1px solid #21262d',
      fontFamily: '"JetBrains Mono", monospace',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px',
        boxShadow: 'inset 0 -1px 0 #21262d',
        background: '#0d1117',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link2 size={14} style={{ color: meta.color }} />
          <span style={{ fontSize: 13, color: '#e6edf3', fontWeight: 600 }}>Connexion</span>
          <span style={{
            fontSize: 10, padding: '2px 8px', borderRadius: 3,
            border: `1px solid ${meta.color}50`,
            color: meta.color, background: `${meta.color}12`,
          }}>
            {meta.label}
          </span>
        </div>
        <button
          onClick={() => setSelectedEdge(null)}
          style={{ color: '#484f58', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 16 }}>

        {/* Type */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 11, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Type</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(Object.keys(EDGE_META) as EdgeType[]).map((t) => {
              const m = EDGE_META[t]
              const active = (data.edgeType ?? 'ethernet') === t
              return (
                <button key={t} onClick={() => upd({ edgeType: t })} style={{
                  fontSize: 11, padding: '4px 10px', borderRadius: 4, cursor: 'pointer',
                  border: `1px solid ${active ? m.color : '#30363d'}`,
                  background: active ? `${m.color}18` : 'transparent',
                  color: active ? m.color : '#8b949e',
                  fontFamily: '"JetBrains Mono", monospace',
                  transition: 'all 0.1s',
                }}>
                  {m.label}
                </button>
              )
            })}
          </div>
        </div>

        <Separator />

        {/* Properties */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 11, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Propriétés</div>
          <Input label="Label"     value={data.label     ?? ''} placeholder="WAN, trunk, uplink…" onChange={(e) => upd({ label:     e.target.value })} />
          <Input label="Débit"     value={data.bandwidth ?? ''} placeholder="1 Gbps, 10G…"        onChange={(e) => upd({ bandwidth: e.target.value })} />
          <Input label="Protocole" value={data.protocol  ?? ''} placeholder="OSPF, BGP, STP…"     onChange={(e) => upd({ protocol:  e.target.value })} />
        </div>

        <Separator />

        {/* Delete */}
        <button
          onClick={() => { deleteEdge(selectedEdgeId); setSelectedEdge(null) }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: 8, borderRadius: 5, cursor: 'pointer',
            border: '1px solid #f8514930',
            background: '#f8514908',
            color: '#f85149', fontSize: 12,
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          <X size={13} />
          Supprimer la connexion
        </button>
      </div>

      {/* Footer: edge id */}
      <div style={{
        marginTop: 'auto', padding: '8px 16px',
        boxShadow: 'inset 0 1px 0 #21262d',
        fontSize: 10, color: '#30363d',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {edge.source} → {edge.target}
      </div>
    </aside>
  )
}
