import { memo } from 'react'
import type { NodeProps, Node } from '@xyflow/react'
import type { FirewallData } from '@/types'
import { NodeBase, NodeBody, NodeField, NodeDivider, NodeTag, NodeTags, T } from './NodeBase'

const FirewallIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l8 4v6c0 5-4 9-8 10C8 21 4 17 4 12V6l8-4z"/>
    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const FirewallNode = memo(function FirewallNode({
  id, data, selected,
}: NodeProps<Node<FirewallData>>) {
  return (
    <NodeBase id={id} nodeType="firewall" label={data.label} selected={selected}
      icon={<FirewallIcon />} iconColor={T.red} width={221}>
      <NodeBody>
        <NodeField label="WAN"      value={data.wan ?? data.ip}  valueColor={T.cyan} />
        <NodeField label="LAN"      value={data.lan} />
        {((data.wan ?? data.ip) || data.lan) && (data.platform || data.rules) && <NodeDivider />}
        <NodeField label="Platform" value={data.platform} />
        <NodeField label="Rules"    value={data.rules}    valueColor={T.amber} />
        {((data.wan ?? data.ip) || data.lan || data.platform || data.rules) && <NodeDivider />}
        <NodeTags>
          <NodeTag variant="cyan">IDS/IPS</NodeTag>
          <NodeTag variant="amber">VPN</NodeTag>
        </NodeTags>
      </NodeBody>
    </NodeBase>
  )
})
