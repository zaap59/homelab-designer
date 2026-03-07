import { memo } from 'react'
import type { NodeProps, Node } from '@xyflow/react'
import type { CloudData } from '@/types'
import { NodeBase, NodeBody, NodeField, NodeDivider, NodeTag, NodeTags, T } from './NodeBase'

const CloudIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
  const pColor = (data.provider && PROVIDER_COLORS[data.provider]) ?? T.cyan
  return (
    <NodeBase id={id} nodeType="cloud" label={data.label} selected={selected}
      icon={<CloudIcon color={pColor} />} iconColor={pColor} width={234}>
      <NodeBody>
        <NodeField label="Provider" value={data.provider} valueColor={pColor} />
        <NodeField label="Service"  value={data.service} />
        {(data.provider || data.service) && (data.region || data.provider) && <NodeDivider />}
        <NodeField label="Région"   value={data.region}   valueColor={T.cyan} />
        <NodeTags>
          {data.provider && <NodeTag variant="blue">{data.provider}</NodeTag>}
        </NodeTags>
      </NodeBody>
    </NodeBase>
  )
})
