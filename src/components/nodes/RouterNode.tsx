import { memo, useEffect } from 'react'
import { Handle, Position, useUpdateNodeInternals, type NodeProps, type Node } from '@xyflow/react'
import type { RouterData } from '@/types'
import { NodeBase, NodeBody, NodeField, NodeDivider, NodeTag, NodeTags, T } from './NodeBase'
import { useConnectedHandles } from './useConnectedHandles'

const RouterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9"/>
    <path d="M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9"/>
    <line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="3" y1="15" x2="21" y2="15"/>
  </svg>
)

export const RouterNode = memo(function RouterNode({
  id, data, selected,
}: NodeProps<Node<RouterData>>) {
  const updateNodeInternals = useUpdateNodeInternals()
  const connected = useConnectedHandles(id)
  const portCount = (data.portCount as number | undefined) ?? 5
  const downCount = Math.max(1, portCount - 1)
  const nodeWidth = Math.max(208, portCount * 13 + 24)

  useEffect(() => { updateNodeInternals(id) }, [id, portCount, updateNodeInternals])

  const activeStyle = { background: T.cyan, borderColor: T.cyan, boxShadow: `0 0 6px ${T.cyan}80` }

  const handles = (
    <>
      {/* WAN — top center */}
      <Handle
        type="target"
        position={Position.Top}
        id="wan"
        style={{ left: '50%', ...(connected.has('wan') ? activeStyle : {}) }}
        title="WAN"
      />
      {/* LAN ports — bottom, distributed */}
      {Array.from({ length: downCount }, (_, i) => {
        const hid = `lan-${i}`
        return (
          <Handle
            key={hid}
            type="source"
            position={Position.Bottom}
            id={hid}
            style={{ left: `${((i + 0.5) / downCount) * 100}%`, ...(connected.has(hid) ? activeStyle : {}) }}
            title={`LAN ${i + 1}`}
          />
        )
      })}
    </>
  )

  return (
    <NodeBase id={id} nodeType="router" label={data.label} selected={selected}
      icon={<RouterIcon />} iconColor={T.cyan} width={nodeWidth}
      customHandles handles={handles}
    >
      <NodeBody>
        <NodeField label="WAN IP" value={data.wanIp} valueColor={T.cyan} />
        <NodeField label="LAN IP" value={data.lanIp} />
        {(data.wanIp || data.lanIp) && (data.model || data.os) && <NodeDivider />}
        <NodeField label="Model"  value={data.model} />
        <NodeField label="OS"     value={data.os} />
        {(data.wanIp || data.lanIp || data.model || data.os) && <NodeDivider />}
        <NodeTags>
          <NodeTag variant="cyan">BGP</NodeTag>
          <NodeTag variant="green">NAT</NodeTag>
          <NodeTag variant="amber">DHCP</NodeTag>
        </NodeTags>

        {/* ── LAN port visual ── */}
        <NodeDivider />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 9, color: T.textDim, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: '"JetBrains Mono", monospace' }}>
            LAN
          </span>
          <span style={{ fontSize: 9, color: T.textDim, fontFamily: '"JetBrains Mono", monospace' }}>
            {portCount}
          </span>
        </div>
        <div style={{ position: 'relative', height: 10, width: nodeWidth, marginLeft: -11 }}>
          {Array.from({ length: downCount }, (_, i) => {
            const on = connected.has(`lan-${i}`)
            return (
              <div key={i} style={{
                position: 'absolute',
                left: `calc(${((i + 0.5) / downCount) * 100}% - 4px)`,
                width: 8, height: 8, borderRadius: 1,
                background: on ? T.cyan : T.bg3,
                border: `1px solid ${on ? T.cyan : `${T.cyan}60`}`,
                boxShadow: on ? `0 0 4px ${T.cyan}80` : 'none',
                transition: 'background 0.15s, box-shadow 0.15s',
              }} />
            )
          })}
        </div>
      </NodeBody>
    </NodeBase>
  )
})
