import { memo } from 'react'
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'
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
  const portCount = (data.portCount as number | undefined) ?? 8
  const nodeWidth = Math.max(208, portCount * 13 + 24)

  const handles = (
    <>
      {/* Uplink — top center */}
      <Handle
        type="target"
        position={Position.Top}
        id="uplink"
        style={{ left: '50%' }}
        title="Uplink"
      />
      {/* Data ports — bottom, distributed */}
      {Array.from({ length: portCount }, (_, i) => (
        <Handle
          key={`port-${i}`}
          type="source"
          position={Position.Bottom}
          id={`port-${i}`}
          style={{ left: `${((i + 0.5) / portCount) * 100}%` }}
          title={`Port ${i + 1}`}
        />
      ))}
    </>
  )

  return (
    <NodeBase id={id} nodeType="switch" label={data.label} selected={selected}
      icon={<SwitchIcon />} iconColor={T.green} width={nodeWidth}
      customHandles handles={handles}
    >
      <NodeBody>
        <NodeField label="Mgmt IP" value={data.ip}    valueColor={T.cyan} />
        <NodeField label="Model"   value={data.model} />
        {(data.ip || data.model) && (data.vlan || data.speed) && <NodeDivider />}
        <NodeField label="VLANs"   value={data.vlan as string | undefined} />
        <NodeField label="Speed"   value={data.speed} valueColor={T.green} />

        {/* ── Port visual ── */}
        <NodeDivider />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 9, color: T.textDim, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: '"JetBrains Mono", monospace' }}>
            Ports
          </span>
          <span style={{ fontSize: 9, color: T.textDim, fontFamily: '"JetBrains Mono", monospace' }}>
            {portCount}
          </span>
        </div>
        {/* Port dots — negative margin cancels body padding (10px each side)
            so the 100% width matches the node width the handles use */}
        <div style={{ position: 'relative', height: 10, marginLeft: -10, marginRight: -10 }}>
          {Array.from({ length: portCount }, (_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `calc(${((i + 0.5) / portCount) * 100}% - 4px)`,
              width: 8, height: 8, borderRadius: 1,
              background: T.bg3,
              border: `1px solid ${T.green}60`,
            }} />
          ))}
        </div>
      </NodeBody>
    </NodeBase>
  )
})
