import { memo } from 'react'
import type { NodeProps, Node } from '@xyflow/react'
import type { ServerData } from '@/types'
import { NodeBase, NodeBody, NodeField, NodeDivider, NodeTag, NodeTags, T } from './NodeBase'

const ServerIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="5" rx="1"/>
    <rect x="2" y="10" width="20" height="5" rx="1"/>
    <rect x="2" y="17" width="20" height="5" rx="1"/>
    <circle cx="18" cy="5.5" r="1" fill="currentColor"/>
    <circle cx="18" cy="12.5" r="1" fill="currentColor"/>
    <circle cx="18" cy="19.5" r="1" fill="currentColor"/>
  </svg>
)

export const ServerNode = memo(function ServerNode({
  id, data, selected,
}: NodeProps<Node<ServerData>>) {
  const vmCount = data.vmCount ?? 0
  const ctCount = data.ctCount ?? 0
  return (
    <NodeBase id={id} nodeType="server" label={data.label} selected={selected}
      icon={<ServerIcon />} iconColor={T.amber} width={234}>
      <NodeBody>
        <NodeField label="IP Address" value={data.ip}      valueColor={T.cyan} />
        <NodeField label="OS"         value={data.os} />
        <NodeDivider />
        <NodeField label="CPU"        value={data.cpu} />
        <NodeField label="RAM"        value={data.ram}     valueColor={T.amber} />
        <NodeField label="Storage"    value={data.storage} />
        <NodeDivider />
        <NodeTags>
          <NodeTag variant="amber">VMs : {vmCount}</NodeTag>
          <NodeTag variant="purple">CTs : {ctCount}</NodeTag>
        </NodeTags>
      </NodeBody>
    </NodeBase>
  )
})
