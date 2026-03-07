import { memo } from 'react'
import type { NodeProps, Node } from '@xyflow/react'
import type { NASData } from '@/types'
import { NodeBase, NodeBody, NodeField, NodeDivider, NodeTag, NodeTags, T } from './NodeBase'

const NASIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2"/>
    <rect x="2" y="14" width="20" height="8" rx="2"/>
    <circle cx="6" cy="6" r="1" fill="currentColor"/>
    <circle cx="6" cy="18" r="1" fill="currentColor"/>
    <line x1="10" y1="6" x2="18" y2="6"/>
    <line x1="10" y1="18" x2="18" y2="18"/>
  </svg>
)

export const NASNode = memo(function NASNode({
  id, data, selected,
}: NodeProps<Node<NASData>>) {
  return (
    <NodeBase id={id} nodeType="nas" label={data.label} selected={selected}
      icon={<NASIcon />} iconColor={T.blue} width={228}>
      <NodeBody>
        <NodeField label="IP"       value={data.ip}       valueColor={T.cyan} />
        <NodeField label="OS"       value={data.os} />
        {(data.ip || data.os) && (data.capacity || data.used) && <NodeDivider />}
        <NodeField label="Capacity" value={data.capacity} valueColor={T.blue} />
        <NodeField label="Used"     value={data.used} />
        {(data.ip || data.os || data.capacity || data.used) && data.protocol && <NodeDivider />}
        {data.protocol && (
          <NodeTags>
            <NodeTag variant="blue">{data.protocol}</NodeTag>
          </NodeTags>
        )}
      </NodeBody>
    </NodeBase>
  )
})
