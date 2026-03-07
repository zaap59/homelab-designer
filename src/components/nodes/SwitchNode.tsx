import { memo } from 'react'
import type { NodeProps, Node } from '@xyflow/react'
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
  return (
    <NodeBase id={id} nodeType="switch" label={data.label} selected={selected}
      icon={<SwitchIcon />} iconColor={T.green} width={208}
    >
      <NodeBody>
        <NodeField label="Mgmt IP" value={data.ip}    valueColor={T.cyan} />
        <NodeField label="Model"   value={data.model} />
        <NodeDivider />
        <NodeField label="VLANs"   value={data.vlan as string | undefined} />
        <NodeField label="Speed"   value={data.speed} valueColor={T.green} />
      </NodeBody>
    </NodeBase>
  )
})

