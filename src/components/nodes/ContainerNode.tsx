import { memo } from 'react'
import type { NodeProps, Node } from '@xyflow/react'
import type { ContainerData } from '@/types'
import { NodeBase, NodeBody, NodeField, NodeDivider, NodeTag, NodeTags, T } from './NodeBase'

const ContainerIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
    <line x1="12" y1="12" x2="12.01" y2="12" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export const ContainerNode = memo(function ContainerNode({
  id, data, selected,
}: NodeProps<Node<ContainerData>>) {
  const shortId = (data.containerId ?? '').substring(0, 8) || undefined
  return (
    <NodeBase id={id} nodeType="container" label={data.label} selected={selected}
      icon={<ContainerIcon />} iconColor={T.pink} width={221}>
      <NodeBody>
        <NodeField label="Image"         value={data.image}   valueColor={T.pink} />
        <NodeField label="Container ID"  value={shortId}      valueColor={T.textDim} />
        {(data.image || shortId) && data.ports && <NodeDivider />}
        <NodeField label="Exposed Ports" value={data.ports} />
        {(data.image || shortId || data.ports) && <NodeDivider />}
        <NodeField label="Network"       value={data.network} />
        <NodeTags>
          <NodeTag variant="pink">{data.runtime ?? 'Docker'}</NodeTag>
          <NodeTag variant="cyan">container</NodeTag>
        </NodeTags>
      </NodeBody>
    </NodeBase>
  )
})
