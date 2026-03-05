import { memo } from 'react'
import type { NodeProps, Node } from '@xyflow/react'
import type { VMData } from '@/types'
import { NodeBase, NodeBody, NodeField, NodeDivider, NodeTag, NodeTags, T } from './NodeBase'

const VMIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="14" rx="2"/>
    <path d="M8 20h8M12 18v2"/>
    <path d="M9 9l2 2-2 2M13 11h2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const VMNode = memo(function VMNode({
  id, data, selected,
}: NodeProps<Node<VMData>>) {
  const cpuRam = [data.cpu, data.ram].filter(Boolean).join(' / ') || undefined
  return (
    <NodeBase id={id} nodeType="vm" label={data.label} selected={selected}
      icon={<VMIcon />} iconColor={T.purple} width={221}>
      <NodeBody>
        <NodeField label="IP"          value={data.ip}         valueColor={T.cyan} />
        <NodeField label="OS"          value={data.os} />
        <NodeDivider />
        <NodeField label="vCPU / RAM"  value={cpuRam}          valueColor={T.purple} />
        <NodeField label="Disk"        value={data.disk} />
        <NodeField label="Hypervisor"  value={data.hypervisor} />
        <NodeDivider />
        <NodeTags>
          {data.vmid != null && <NodeTag variant="purple">VMID {data.vmid}</NodeTag>}
          {data.vlan != null && <NodeTag variant="cyan">VLAN {data.vlan}</NodeTag>}
        </NodeTags>
      </NodeBody>
    </NodeBase>
  )
})
