import { memo } from 'react'
import type { NodeProps, Node } from '@xyflow/react'
import type { ServerData } from '@/types'
import { NodeBase } from './NodeBase'

const ServerIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" />
    <circle cx="6" cy="6" r="1" fill={color} stroke="none" />
    <circle cx="6" cy="18" r="1" fill={color} stroke="none" />
    <line x1="10" y1="6" x2="18" y2="6" strokeWidth="1.5" />
    <line x1="10" y1="18" x2="18" y2="18" strokeWidth="1.5" />
  </svg>
)

export const ServerNode = memo(function ServerNode({
  id, data, selected,
}: NodeProps<Node<ServerData>>) {
  const color = '#7c4dff'
  const fields = []
  if (data.ip)  fields.push({ label: 'IP',  value: data.ip,  color: '#7c4dff' })
  if (data.os)  fields.push({ label: 'OS',  value: data.os })
  if (data.cpu) fields.push({ label: 'CPU', value: data.cpu })
  if (data.ram) fields.push({ label: 'RAM', value: data.ram })

  return (
    <NodeBase id={id} nodeType="server" label={data.label} selected={selected}
      icon={<ServerIcon color={color} />} fields={fields} />
  )
})
