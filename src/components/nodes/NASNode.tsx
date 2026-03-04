import { memo } from 'react'
import type { NodeProps, Node } from '@xyflow/react'
import type { NASData } from '@/types'
import { NodeBase } from './NodeBase'

const NASIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="4" rx="1" />
    <rect x="2" y="10" width="20" height="4" rx="1" />
    <rect x="2" y="16" width="20" height="4" rx="1" />
    <circle cx="18" cy="6" r="0.8" fill={color} stroke="none" />
    <circle cx="18" cy="12" r="0.8" fill={color} stroke="none" />
    <circle cx="18" cy="18" r="0.8" fill={color} stroke="none" />
  </svg>
)

export const NASNode = memo(function NASNode({
  id, data, selected,
}: NodeProps<Node<NASData>>) {
  const color = '#ffd740'
  const fields = []
  if (data.ip)       fields.push({ label: 'IP',       value: data.ip,       color: '#ffd740' })
  if (data.capacity) fields.push({ label: 'Capacité', value: data.capacity })
  if (data.protocol) fields.push({ label: 'Protocole', value: data.protocol })

  return (
    <NodeBase id={id} nodeType="nas" label={data.label} selected={selected}
      icon={<NASIcon color={color} />} fields={fields} />
  )
})
