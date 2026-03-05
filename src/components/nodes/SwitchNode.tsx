import { memo } from 'react'
import { Handle, Position, useHandleConnections } from '@xyflow/react'
import type { NodeProps, Node } from '@xyflow/react'
import type { SwitchData } from '@/types'
import { NodeBase, NodeBody, NodeField, NodeDivider, T } from './NodeBase'

const SwitchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="10" rx="2"/>
    <circle cx="6"  cy="12" r="1.5" fill="currentColor"/>
    <circle cx="10" cy="12" r="1.5" fill="currentColor"/>
    <circle cx="14" cy="12" r="1.5" fill="currentColor"/>
    <circle cx="18" cy="12" r="1.5" fill="currentColor"/>
    <path d="M7 4l3 3-3 3M17 20l-3-3 3-3" strokeLinecap="round"/>
  </svg>
)

export const SwitchNode = memo(function SwitchNode({
  id, data, selected,
}: NodeProps<Node<SwitchData>>) {
  const rj45Count      = data.rj45Count      ?? 8
  const sfpCount       = data.sfpCount       ?? 2
  const connectedPorts = (data.connectedPorts as number[]) ?? []
  const total          = rj45Count + sfpCount

  // L'uplink (top handle) compte comme 1 port — n'afficher que total-1 en bas
  const displayCount = Math.max(0, total - 1)
  const displayRj45  = Math.min(rj45Count, displayCount)
  const displaySfp   = Math.max(0, displayCount - displayRj45)

  // Détecter si l'uplink est connecté pour l'activer visuellement
  const uplinkConns    = useHandleConnections({ type: 'target', id: 'uplink', nodeId: id })
  const uplinkActive   = uplinkConns.length > 0

  const switchHandles = (
    <>
      {/* Static handles */}
      <Handle type="target" position={Position.Top}   id="uplink" />
      <Handle type="source" position={Position.Left}  id="left" />
      <Handle type="source" position={Position.Right} id="right" />

      {/* Dynamic port handles */}
      {Array.from({ length: displayCount }, (_, i) => {
        const leftPct = ((i + 0.5) / displayCount) * 100
        const isConn  = connectedPorts.includes(i)
        const isSFP   = i >= displayRj45
        return (
          <Handle key={`port-${i}`} type="source" position={Position.Bottom} id={`port-${i}`}
            style={{
              left: `${leftPct}%`,
              background: isConn ? T.green : isSFP ? 'rgba(255,170,0,0.2)' : T.bg3,
              border: `2px solid ${isConn ? T.green : isSFP ? T.amber : T.borderBright}`,
              boxShadow: isConn ? '0 0 5px rgba(57,255,20,0.5)' : 'none',
            }}
          />
        )
      })}
    </>
  )

  return (
    <NodeBase id={id} nodeType="switch" label={data.label} selected={selected}
      icon={<SwitchIcon />} iconColor={T.green} width={Math.max(247, displayCount * 29 + 26)}
      customHandles handles={switchHandles}
    >
      {/* ── Fields section ─ */}
      <NodeBody>
        <NodeField label="Mgmt IP" value={data.ip}    valueColor={T.cyan} />
        <NodeField label="Model"   value={data.model} />
        <NodeDivider />
        <NodeField label="VLANs"   value={data.vlan  as string | undefined} />
        <NodeField label="Speed"   value={data.speed} valueColor={T.green} />
      </NodeBody>

      {/* ── Port label row (avec indicateur uplink) ─ */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: 8, letterSpacing: '1px', textTransform: 'uppercase',
        padding: '0 10px 6px', color: T.textDim,
      }}>
        {/* Uplink indicator : s'allume quand une connexion entre sur le nœud */}
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
            background: uplinkActive ? T.green : T.borderBright,
            boxShadow: uplinkActive ? `0 0 5px ${T.green}` : 'none',
            transition: 'all 0.2s',
          }} />
          <span style={{ color: uplinkActive ? T.green : T.textDim }}>Uplink</span>
        </span>
      </div>

      {/* ── Port slots ─ */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 3,
        padding: '8px 10px 14px', borderTop: `1px solid ${T.border}`,
      }}>
        {/* RJ45 (total-1 ports) */}
        {Array.from({ length: displayRj45 }, (_, i) => {
          const on = connectedPorts.includes(i)
          return (
            <div key={i} style={{
              width: 18, height: 12, borderRadius: 2,
              background: on ? 'rgba(57,255,20,0.12)' : T.bg3,
              border: `1px solid ${on ? T.green : T.border}`,
              cursor: 'crosshair', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {on && <div style={{ width: 5, height: 5, borderRadius: '50%', background: T.green, boxShadow: `0 0 4px ${T.green}` }} />}
            </div>
          )
        })}
        {/* SFP */}
        {Array.from({ length: displaySfp }, (_, i) => (
          <div key={`sfp-${i}`} style={{
            width: 22, height: 12, borderRadius: 2,
            background: 'rgba(255,170,0,0.12)',
            border: `1px solid ${T.amber}`,
            cursor: 'crosshair',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: T.amber, boxShadow: `0 0 4px ${T.amber}` }} />
          </div>
        ))}
      </div>

    </NodeBase>
  )
})

