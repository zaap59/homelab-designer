import { memo } from 'react'
import type { NodeProps, Node } from '@xyflow/react'
import type { VMData } from '@/types'
import { NodeBase } from './NodeBase'

const VMIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
    <path d="M9 8l3 3 3-3" strokeWidth="1.5" />
  </svg>
)

export const VMNode = memo(function VMNode({
  id, data, selected,
}: NodeProps<Node<VMData>>) {
  const color = '#00e676'
  const badges = []
  if (data.ip) badges.push({ label: 'ip', value: data.ip, color: '#00e676' })
  if (data.os) badges.push({ label: 'os', value: data.os })
  if (data.hypervisor) badges.push({ label: 'hv', value: data.hypervisor })
  if (data.cpu) badges.push({ label: 'cpu', value: data.cpu })
  if (data.ram) badges.push({ label: 'ram', value: data.ram })

  return (
    <NodeBase id={id} nodeType="vm" label={data.label} selected={selected}
      icon={<VMIcon color={color} />} badges={badges} />
  )
})
