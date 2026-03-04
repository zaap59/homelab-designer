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
  const fields = []
  if (data.ip)         fields.push({ label: 'IP',          value: data.ip,         color: '#00e676' })
  if (data.os)         fields.push({ label: 'OS',          value: data.os })
  if (data.hypervisor) fields.push({ label: 'Hyperviseur', value: data.hypervisor })
  if (data.cpu)        fields.push({ label: 'CPU',         value: data.cpu })
  if (data.ram)        fields.push({ label: 'RAM',         value: data.ram })

  return (
    <NodeBase id={id} nodeType="vm" label={data.label} selected={selected}
      icon={<VMIcon color={color} />} fields={fields} />
  )
})
