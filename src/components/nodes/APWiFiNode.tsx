import { memo } from 'react'
import type { NodeProps, Node } from '@xyflow/react'
import type { APWiFiData } from '@/types'
import { NodeBase } from './NodeBase'

const APWiFiIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <circle cx="12" cy="20" r="1" fill={color} stroke="none" />
  </svg>
)

export const APWiFiNode = memo(function APWiFiNode({
  id, data, selected,
}: NodeProps<Node<APWiFiData>>) {
  const color = '#69ff47'
  const badges: { label: string; value: string; color?: string }[] = []
  if (data.ssid)      badges.push({ label: 'SSID',  value: data.ssid,      color: '#69ff47' })
  if (data.band)      badges.push({ label: 'band',  value: data.band })
  if (data.frequency) badges.push({ label: 'freq',  value: data.frequency })
  if (data.ip)        badges.push({ label: 'ip',    value: data.ip })

  return (
    <NodeBase id={id} nodeType="apwifi" label={data.label} selected={selected}
      icon={<APWiFiIcon color={color} />} badges={badges} minWidth={165} />
  )
})
