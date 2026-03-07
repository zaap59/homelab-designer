import { memo } from 'react'
import type { NodeProps, Node } from '@xyflow/react'
import type { CameraData } from '@/types'
import { NodeBase, NodeBody, NodeField, NodeDivider, NodeTag, NodeTags, T } from './NodeBase'

const CameraIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 7l-7 5 7 5V7z"/>
    <rect x="1" y="5" width="15" height="14" rx="2"/>
    <circle cx="8.5" cy="12" r="3"/>
  </svg>
)

export const CameraNode = memo(function CameraNode({
  id, data, selected,
}: NodeProps<Node<CameraData>>) {
  return (
    <NodeBase id={id} nodeType="camera" label={data.label} selected={selected}
      icon={<CameraIcon />} iconColor={T.orange} width={221}>
      <NodeBody>
        <NodeField label="IP"         value={data.ip}         valueColor={T.cyan} />
        <NodeField label="Location"   value={data.location} />
        <NodeDivider />
        <NodeField label="Resolution" value={data.resolution} valueColor={T.orange} />
        <NodeField label="Protocol"   value={data.protocol} />
        <NodeDivider />
        <NodeTags>
          {data.ptz      && <NodeTag variant="amber">PTZ</NodeTag>}
          {data.outdoor
            ? <NodeTag variant="green">Outdoor</NodeTag>
            : <NodeTag variant="blue">Indoor</NodeTag>}
          {data.protocol && <NodeTag variant="cyan">{data.protocol}</NodeTag>}
        </NodeTags>
      </NodeBody>
    </NodeBase>
  )
})
