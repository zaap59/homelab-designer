import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import type { NodeProps, Node } from '@xyflow/react'
import type { SwitchData } from '@/types'
import { NodeBase } from './NodeBase'

const SwitchIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="8" width="20" height="8" rx="2" />
    <line x1="6" y1="12" x2="6" y2="12.01" strokeWidth="3" />
    <line x1="10" y1="12" x2="10" y2="12.01" strokeWidth="3" />
    <line x1="14" y1="12" x2="14" y2="12.01" strokeWidth="3" />
    <line x1="18" y1="12" x2="18" y2="12.01" strokeWidth="3" />
  </svg>
)

// ─── Port visualization ────────────────────────────────────────────────────────

interface PortGridProps {
  rj45Count: number
  sfpCount: number
  connectedPorts: number[]
  color: string
}

function PortGrid({ rj45Count, sfpCount, connectedPorts, color }: PortGridProps) {
  const total = rj45Count + sfpCount
  return (
    <div className="px-2 py-2">
      {/* RJ45 ports */}
      {rj45Count > 0 && (
        <div className="mb-1.5">
          <span className="text-[8px] uppercase tracking-widest text-[#484f58] block mb-1">
            RJ45 ({rj45Count})
          </span>
          <div className="flex flex-wrap gap-[3px]">
            {Array.from({ length: rj45Count }, (_, i) => {
              const connected = connectedPorts.includes(i)
              return (
                <div
                  key={i}
                  title={`Port ${i + 1}`}
                  className="w-[10px] h-[8px] rounded-sm border transition-colors"
                  style={{
                    borderColor: connected ? color : '#30363d',
                    background: connected ? `${color}40` : '#0d1117',
                    boxShadow: connected ? `0 0 4px ${color}60` : 'none',
                  }}
                />
              )
            })}
          </div>
        </div>
      )}
      {/* SFP ports */}
      {sfpCount > 0 && (
        <div>
          <span className="text-[8px] uppercase tracking-widest text-[#484f58] block mb-1">
            SFP ({sfpCount})
          </span>
          <div className="flex flex-wrap gap-[3px]">
            {Array.from({ length: sfpCount }, (_, i) => {
              const portIdx = rj45Count + i
              const connected = connectedPorts.includes(portIdx)
              return (
                <div
                  key={i}
                  title={`SFP ${i + 1}`}
                  className="w-[12px] h-[8px] rounded-sm border transition-colors"
                  style={{
                    borderColor: connected ? '#40c4ff' : '#30363d',
                    background: connected ? '#40c4ff30' : '#0d1117',
                    boxShadow: connected ? '0 0 4px #40c4ff60' : 'none',
                  }}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Dynamic handles per port — positioned across the bottom */}
      {Array.from({ length: total }, (_, i) => (
        <Handle
          key={i}
          type="source"
          position={Position.Bottom}
          id={`port-${i}`}
          style={{
            left: `${((i + 0.5) / total) * 100}%`,
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

// ─── SwitchNode ───────────────────────────────────────────────────────────────

export const SwitchNode = memo(function SwitchNode({
  id, data, selected,
}: NodeProps<Node<SwitchData>>) {
  const color = '#4fc3f7'
  const rj45Count      = data.rj45Count      ?? 8
  const sfpCount       = data.sfpCount       ?? 2
  const connectedPorts = (data.connectedPorts as number[]) ?? []

  const fields = []
  if (data.ip)    fields.push({ label: 'IP',    value: data.ip,    color })
  if (data.vlan)  fields.push({ label: 'VLAN',  value: data.vlan })
  if (data.speed) fields.push({ label: 'Vitesse', value: data.speed })

  return (
    <NodeBase
      id={id}
      nodeType="switch"
      label={data.label}
      selected={selected}
      icon={<SwitchIcon color={color} />}
      fields={fields}
      customHandles
      minWidth={190}
    >
      <PortGrid
        rj45Count={rj45Count}
        sfpCount={sfpCount}
        connectedPorts={connectedPorts}
        color={color}
      />
      {/* Uplink handle at top */}
      <Handle
        type="target"
        position={Position.Top}
        id="uplink"
        style={{ top: -5, left: '50%', transform: 'translateX(-50%)', width: 8, height: 8,
          background: '#161b22', border: '1.5px solid #4fc3f7' }}
      />
    </NodeBase>
  )
})

