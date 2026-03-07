import { memo } from 'react'
import type { NodeProps, Node } from '@xyflow/react'
import type { RouterData } from '@/types'
import { NodeBase, NodeBody, NodeField, NodeDivider, NodeTag, NodeTags, T } from './NodeBase'

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
  return (
    <NodeBase id={id} nodeType="router" label={data.label} selected={selected}
      icon={<RouterIcon />} iconColor={T.cyan} width={208}>
      <NodeBody>
        <NodeField label="WAN IP"  value={data.wanIp} valueColor={T.cyan} />
        <NodeField label="LAN IP"  value={data.lanIp} />
        {(data.wanIp || data.lanIp) && (data.model || data.os) && <NodeDivider />}
        <NodeField label="Model"   value={data.model} />
        <NodeField label="OS"      value={data.os} />
        {(data.wanIp || data.lanIp || data.model || data.os) && <NodeDivider />}
        <NodeTags>
          <NodeTag variant="cyan">BGP</NodeTag>
          <NodeTag variant="green">NAT</NodeTag>
          <NodeTag variant="amber">DHCP</NodeTag>
        </NodeTags>
      </NodeBody>
    </NodeBase>
  )
})

