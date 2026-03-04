import { memo } from 'react'
import type { NodeProps, Node } from '@xyflow/react'
import type { RouterData } from '@/types'
import { NodeBase } from './NodeBase'

// Router SVG icon
const RouterIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    <path d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
)

export const RouterNode = memo(function RouterNode({
  id, data, selected,
}: NodeProps<Node<RouterData>>) {
  const color = '#ff6b35'
  const badges = []
  if (data.ip) badges.push({ label: 'ip', value: data.ip, color: '#ff6b35' })
  if (data.model) badges.push({ label: 'model', value: data.model })

  return (
    <NodeBase id={id} nodeType="router" label={data.label} selected={selected}
      icon={<RouterIcon color={color} />} badges={badges} />
  )
})
