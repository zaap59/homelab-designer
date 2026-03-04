import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import type { NodeProps, Node } from '@xyflow/react'
import type { RouterData } from '@/types'
import { NodeBase } from './NodeBase'

// Router SVG icon
const RouterIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    <path d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
)

// ─── RouterPorts ──────────────────────────────────────────────────────────────

interface RouterPortsProps {
  portCount: number
  connectedPorts: number[]
  color: string
}

function RouterPorts({ portCount, connectedPorts, color }: RouterPortsProps) {
  return (
    <div className="px-2 py-2">
      <span className="text-[8px] uppercase tracking-widest text-[#484f58] block mb-1.5">
        Ports LAN ({portCount})
      </span>
      <div className="flex gap-[3px]">
        {Array.from({ length: portCount }, (_, i) => {
          const connected = connectedPorts.includes(i)
          return (
            <div
              key={i}
              title={`Port ${i + 1}`}
              className="flex-1 h-[8px] rounded-sm border transition-colors"
              style={{
                borderColor: connected ? color : '#30363d',
                background: connected ? `${color}40` : '#0d1117',
                boxShadow: connected ? `0 0 4px ${color}60` : 'none',
              }}
            />
          )
        })}
      </div>

      {/* Dynamic LAN handles — distributed across the bottom */}
      {Array.from({ length: portCount }, (_, i) => (
        <Handle
          key={i}
          type="source"
          position={Position.Bottom}
          id={`port-${i}`}
          style={{
            left: `${((i + 0.5) / portCount) * 100}%`,
            bottom: -5,
            transform: 'translateX(-50%)',
            width: 8,
            height: 8,
            background: connectedPorts.includes(i) ? color : '#131920',
            border: `1.5px solid ${connectedPorts.includes(i) ? color : '#484f58'}`,
          }}
        />
      ))}
    </div>
  )
}

// ─── RouterNode ───────────────────────────────────────────────────────────────

export const RouterNode = memo(function RouterNode({
  id, data, selected,
}: NodeProps<Node<RouterData>>) {
  const color = '#ff6b35'
  const portCount      = data.portCount      ?? 5
  const connectedPorts = (data.connectedPorts as number[]) ?? []

  const fields = []
  if (data.ip)    fields.push({ label: 'IP',    value: data.ip,    color })
  if (data.wanIp) fields.push({ label: 'WAN',   value: data.wanIp, color: '#ff9100' })
  if (data.lanIp) fields.push({ label: 'LAN',   value: data.lanIp })
  if (data.model) fields.push({ label: 'Modèle', value: data.model })
  if (data.os)    fields.push({ label: 'OS',    value: data.os })

  return (
    <NodeBase
      id={id}
      nodeType="router"
      label={data.label}
      selected={selected}
      icon={<RouterIcon color={color} />}
      fields={fields}
      customHandles
      minWidth={180}
    >
      <RouterPorts
        portCount={portCount}
        connectedPorts={connectedPorts}
        color={color}
      />
      {/* WAN handle at top */}
      <Handle
        type="target"
        position={Position.Top}
        id="wan"
        style={{ top: -5, left: '50%', transform: 'translateX(-50%)', width: 8, height: 8,
          background: '#161b22', border: '1.5px solid #ff6b35' }}
      />
    </NodeBase>
  )
})

