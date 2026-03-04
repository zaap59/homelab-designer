import { memo } from 'react'
import type { NodeProps, Node } from '@xyflow/react'
import type { ContainerData } from '@/types'
import { NodeBase } from './NodeBase'

// Docker-inspired icon
const ContainerIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12.5c0 .3-.2.7-.6.9-1.4.8-5 2.6-8.4 2.6S5 14.2 3.6 13.4C3.2 13.2 3 12.8 3 12.5V8l9-4 10 4v4.5Z" />
    <path d="M12 4.5v11M7 7l5-2.5M17 7l-5-2.5" strokeWidth="1.2" />
  </svg>
)

export const ContainerNode = memo(function ContainerNode({
  id, data, selected,
}: NodeProps<Node<ContainerData>>) {
  const color = '#ff4081'
  const badges = []
  if (data.image) badges.push({ label: 'img', value: data.image, color: '#ff4081' })
  if (data.ports) badges.push({ label: 'ports', value: data.ports })

  return (
    <NodeBase id={id} nodeType="container" label={data.label} selected={selected}
      icon={<ContainerIcon color={color} />} badges={badges} />
  )
})
