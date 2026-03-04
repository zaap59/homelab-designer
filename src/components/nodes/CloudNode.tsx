import { memo } from 'react'
import type { NodeProps, Node } from '@xyflow/react'
import type { CloudData } from '@/types'
import { NodeBase } from './NodeBase'

const CloudIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10Z" />
  </svg>
)

const PROVIDER_COLORS: Record<string, string> = {
  AWS: '#ff9900',
  GCP: '#4285f4',
  Azure: '#0089d6',
  Cloudflare: '#f48120',
  Hetzner: '#d50c2d',
}

export const CloudNode = memo(function CloudNode({
  id, data, selected,
}: NodeProps<Node<CloudData>>) {
  const providerColor = (data.provider && PROVIDER_COLORS[data.provider]) ?? '#40c4ff'
  const badges = []
  if (data.provider) badges.push({ label: 'provider', value: data.provider, color: providerColor })
  if (data.service) badges.push({ label: 'service', value: data.service })
  if (data.region) badges.push({ label: 'region', value: data.region })

  return (
    <NodeBase id={id} nodeType="cloud" label={data.label} selected={selected}
      icon={<CloudIcon color={providerColor} />} badges={badges} minWidth={180} />
  )
})
