import { memo, useEffect } from 'react'
import { Handle, Position, useUpdateNodeInternals, type NodeProps, type Node } from '@xyflow/react'
import type { SwitchData } from '@/types'
import { NodeBase, NodeBody, NodeField, NodeDivider, T } from './NodeBase'
import { useConnectedHandles } from './useConnectedHandles'

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
  const updateNodeInternals = useUpdateNodeInternals()
  const connected  = useConnectedHandles(id)
  const portCount  = (data.portCount as number | undefined) ?? 8
  const downCount  = Math.max(1, portCount - 1)
  const nodeWidth  = Math.max(208, portCount * 13 + 24)

  useEffect(() => { updateNodeInternals(id) }, [id, portCount, updateNodeInternals])

  const activeStyle = { background: T.green, borderColor: T.green, boxShadow: `0 0 6px ${T.green}80` }

  const handles = (
    <>
      {/* Uplink — top center */}
      <Handle
        type="target"
        position={Position.Top}
        id="uplink"
        className={connected.has('uplink') ? 'hlab-handle-connected' : undefined}
        style={{ left: '50%', ...(connected.has('uplink') ? activeStyle : {}) }}
        title="Uplink"
      />
      {/* Data ports — bottom, distributed */}
      {Array.from({ length: downCount }, (_, i) => {
        const hid = `port-${i}`
        const on = connected.has(hid)
        return (
          <Handle
            key={hid}
            type="source"
            position={Position.Bottom}
            id={hid}
            className={on ? 'hlab-handle-connected' : undefined}
            style={{ left: `${((i + 0.5) / downCount) * 100}%`, ...(on ? activeStyle : {}) }}
            title={`Port ${i + 1}`}
          />
        )
      })}
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
        {/* Port dots — explicit nodeWidth + offset -(body padding 10 + card border 1)
            so the container spans exactly the same reference as the handles */}
        <div style={{ position: 'relative', height: 10, width: nodeWidth, marginLeft: -11 }}>
          {Array.from({ length: downCount }, (_, i) => {
            const on = connected.has(`port-${i}`)
            return (
              <div key={i} style={{
                position: 'absolute',
                left: `calc(${((i + 0.5) / downCount) * 100}% - 4px)`,
                width: 8, height: 8, borderRadius: 1,
                background: on ? T.green : T.bg3,
                border: `1px solid ${on ? T.green : `${T.green}60`}`,
                boxShadow: on ? `0 0 4px ${T.green}80` : 'none',
                transition: 'background 0.15s, box-shadow 0.15s',
              }} />
            )
          })}
        </div>
      </NodeBody>
    </NodeBase>
  )
})
