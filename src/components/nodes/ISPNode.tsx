import { memo } from 'react'
import type { NodeProps, Node } from '@xyflow/react'
import type { ISPData } from '@/types'
import { NodeBase } from './NodeBase'

const ISPIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

export const ISPNode = memo(function ISPNode({
  id, data, selected,
}: NodeProps<Node<ISPData>>) {
  const color = '#e040fb'
  const fields: { label: string; value: string; color?: string }[] = []
  if (data.asn)    fields.push({ label: 'ASN',    value: data.asn,    color: '#e040fb' })
  if (data.uplink) fields.push({ label: 'Uplink', value: data.uplink })
  if (data.ip)     fields.push({ label: 'IP',     value: data.ip })

  return (
    <NodeBase id={id} nodeType="isp" label={data.label} selected={selected}
      icon={<ISPIcon color={color} />} fields={fields} minWidth={170} />
  )
})
