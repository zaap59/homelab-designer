import { memo } from 'react'
import type { NodeProps, Node } from '@xyflow/react'
import type { ISPData } from '@/types'
import { NodeBase, NodeBody, NodeField, NodeDivider, NodeTag, NodeTags, T } from './NodeBase'

const ISPIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

export const ISPNode = memo(function ISPNode({
  id, data, selected,
}: NodeProps<Node<ISPData>>) {
  return (
    <NodeBase id={id} nodeType="isp" label={data.label} selected={selected}
      icon={<ISPIcon />} iconColor={T.magenta} width={221}>
      <NodeBody>
        <NodeField label="ASN"    value={data.asn}    valueColor={T.magenta} />
        <NodeField label="Uplink" value={data.uplink} />
        <NodeDivider />
        <NodeField label="IP"     value={data.ip}     valueColor={T.cyan} />
        <NodeTags>
          <NodeTag variant="purple">ISP</NodeTag>
        </NodeTags>
      </NodeBody>
    </NodeBase>
  )
})
