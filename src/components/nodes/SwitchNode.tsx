import { memo } from 'react'
import type { NodeProps, Node } from '@xyflow/react'
import type { SwitchData } from '@/types'
import { NodeBase } from './NodeBase'

const SwitchIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="8" width="20" height="8" rx="2" />
    <line x1="6" y1="12" x2="6" y2="12.01" strokeWidth="3" />
    <line x1="10" y1="12" x2="10" y2="12.01" strokeWidth="3" />
    <line x1="14" y1="12" x2="14" y2="12.01" strokeWidth="3" />
    <line x1="18" y1="12" x2="18" y2="12.01" strokeWidth="3" />
  </svg>
)

export const SwitchNode = memo(function SwitchNode({
  id, data, selected,
}: NodeProps<Node<SwitchData>>) {
  const color = '#4fc3f7'
  const badges = []
  if (data.vlan) badges.push({ label: 'vlan', value: data.vlan, color: '#4fc3f7' })
  if (data.ports) badges.push({ label: 'ports', value: data.ports })
  if (data.ip) badges.push({ label: 'ip', value: data.ip })

  return (
    <NodeBase id={id} nodeType="switch" label={data.label} selected={selected}
      icon={<SwitchIcon color={color} />} badges={badges} />
  )
})
