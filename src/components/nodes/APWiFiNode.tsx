import { memo } from 'react'
import type { NodeProps, Node } from '@xyflow/react'
import type { APWiFiData } from '@/types'
import { NodeBase, NodeBody, NodeField, NodeDivider, NodeTag, NodeTags, T } from './NodeBase'

const APWiFiIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none" />
  </svg>
)

export const APWiFiNode = memo(function APWiFiNode({
  id, data, selected,
}: NodeProps<Node<APWiFiData>>) {
  return (
    <NodeBase id={id} nodeType="apwifi" label={data.label} selected={selected}
      icon={<APWiFiIcon />} iconColor={T.green} width={215}>
      <NodeBody>
        <NodeField label="SSID"      value={data.ssid}      valueColor={T.green} />
        <NodeField label="Bande"     value={data.band} />
        <NodeDivider />
        <NodeField label="Fréquence" value={data.frequency} />
        <NodeField label="IP"        value={data.ip}        valueColor={T.cyan} />
        <NodeTags>
          <NodeTag variant="green">WiFi</NodeTag>
        </NodeTags>
      </NodeBody>
    </NodeBase>
  )
})
