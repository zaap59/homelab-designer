import { X, Link2 } from 'lucide-react'
import { useStore } from '@/store/useStore'
import type { EdgeType, HLabEdgeData } from '@/types'
import { EDGE_META } from '@/types'
import { Input } from '@/components/ui/Input'
import { Separator } from '@/components/ui/Separator'

export function EdgePropertiesPanel() {
  const edges          = useStore((s) => s.edges)
  const selectedEdgeId = useStore((s) => s.selectedEdgeId)
  const setSelectedEdge = useStore((s) => s.setSelectedEdge)
  const updateEdgeData = useStore((s) => s.updateEdgeData)
  const deleteEdge     = useStore((s) => s.deleteEdge)

  if (!selectedEdgeId) return null
  const edge = edges.find((e) => e.id === selectedEdgeId)
  if (!edge) return null

  const data: HLabEdgeData = edge.data ?? { edgeType: 'ethernet' }
  const meta = EDGE_META[data.edgeType ?? 'ethernet']

  const upd = (patch: Partial<HLabEdgeData>) => updateEdgeData(selectedEdgeId, patch)

  return (
    <aside
      className="flex flex-col shrink-0 overflow-y-auto border-l"
      style={{
        width: 240,
        background: '#0d1117',
        borderColor: '#21262d',
        fontFamily: '"JetBrains Mono", monospace',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2.5 border-b sticky top-0 z-10"
        style={{ background: '#0d1117', borderColor: '#21262d' }}
      >
        <div className="flex items-center gap-2">
          <Link2 size={12} style={{ color: meta.color }} />
          <span style={{ fontSize: 10, color: '#e6edf3', fontWeight: 600 }}>
            Connexion
          </span>
          <span
            style={{
              fontSize: 8, padding: '1px 6px', borderRadius: 3,
              border: `1px solid ${meta.color}50`,
              color: meta.color,
              background: `${meta.color}12`,
            }}
          >
            {meta.label}
          </span>
        </div>
        <button
          onClick={() => setSelectedEdge(null)}
          style={{ color: '#484f58', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}
        >
          <X size={13} />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-4 px-3 py-3">

        {/* Type selector */}
        <div className="flex flex-col gap-1.5">
          <div style={{ fontSize: 9, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Type</div>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(EDGE_META) as EdgeType[]).map((t) => {
              const m = EDGE_META[t]
              const active = (data.edgeType ?? 'ethernet') === t
              return (
                <button
                  key={t}
                  onClick={() => upd({ edgeType: t })}
                  style={{
                    fontSize: 9, padding: '3px 8px', borderRadius: 4, cursor: 'pointer',
                    border: `1px solid ${active ? m.color : '#30363d'}`,
                    background: active ? `${m.color}18` : 'transparent',
                    color: active ? m.color : '#8b949e',
                    fontFamily: '"JetBrains Mono", monospace',
                    transition: 'all 0.1s',
                  }}
                >
                  {m.label}
                </button>
              )
            })}
          </div>
        </div>

        <Separator />

        {/* Fields */}
        <div className="flex flex-col gap-2.5">
          <div style={{ fontSize: 9, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Propriétés</div>
          <Input
            label="Label"
            value={data.label ?? ''}
            placeholder="WAN, trunk, uplink…"
            onChange={(e) => upd({ label: e.target.value })}
          />
          <Input
            label="Débit"
            value={data.bandwidth ?? ''}
            placeholder="1 Gbps, 10G…"
            onChange={(e) => upd({ bandwidth: e.target.value })}
          />
          <Input
            label="Protocole"
            value={data.protocol ?? ''}
            placeholder="OSPF, BGP, STP…"
            onChange={(e) => upd({ protocol: e.target.value })}
          />
        </div>

        <Separator />

        {/* Options */}
        <div className="flex flex-col gap-2">
          <div style={{ fontSize: 9, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Options</div>
          <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={data.directed ?? false}
              onChange={(e) => upd({ directed: e.target.checked })}
              style={{ accentColor: '#00e5ff', cursor: 'pointer' }}
            />
            <span style={{ fontSize: 10, color: '#8b949e' }}>Flèche directionnelle</span>
          </label>
        </div>

        <Separator />

        {/* Delete */}
        <button
          onClick={() => { deleteEdge(selectedEdgeId); setSelectedEdge(null) }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '7px', borderRadius: 5, cursor: 'pointer',
            border: '1px solid #f8514930',
            background: '#f8514908',
            color: '#f85149',
            fontSize: 10,
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          <X size={11} />
          Supprimer la connexion
        </button>
      </div>

      {/* Footer */}
      <div className="mt-auto px-3 py-2 border-t" style={{ borderColor: '#21262d' }}>
        <div style={{ fontSize: 8, color: '#30363d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {edge.source} → {edge.target}
        </div>
      </div>
    </aside>
  )
}
