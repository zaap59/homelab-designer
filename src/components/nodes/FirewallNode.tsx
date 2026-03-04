import { memo } from 'react'
import type { NodeProps, Node } from '@xyflow/react'
import type { FirewallData } from '@/types'
import { NodeBase } from './NodeBase'

const FirewallIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L4 6v6c0 5.5 3.4 10.7 8 12 4.6-1.3 8-6.5 8-12V6L12 2Z" />
    <path d="M9 12l2 2 4-4" strokeWidth="2" />
  </svg>
)

export const FirewallNode = memo(function FirewallNode({
  id, data, selected,
}: NodeProps<Node<FirewallData>>) {
  const color = '#ff9100'
  const fields = []
  if (data.ip)    fields.push({ label: 'IP',    value: data.ip,    color: '#ff9100' })
  if (data.rules) fields.push({ label: 'Règles', value: data.rules })

  return (
    <NodeBase id={id} nodeType="firewall" label={data.label} selected={selected}
      icon={<FirewallIcon color={color} />} fields={fields} />
  )
})
