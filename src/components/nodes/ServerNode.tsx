import { memo } from 'react'
import { Container } from 'lucide-react'
import type { NodeProps, Node } from '@xyflow/react'
import type { ServerData, ServiceEntry } from '@/types'
import { NodeBase, NodeBody, NodeField, NodeDivider, T } from './NodeBase'

const ServerIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="5" rx="1"/>
    <rect x="2" y="10" width="20" height="5" rx="1"/>
    <rect x="2" y="17" width="20" height="5" rx="1"/>
    <circle cx="18" cy="5.5" r="1" fill="currentColor"/>
    <circle cx="18" cy="12.5" r="1" fill="currentColor"/>
    <circle cx="18" cy="19.5" r="1" fill="currentColor"/>
  </svg>
)

function ImageLabel({ image }: { image: string }) {
  const colonIdx = image.lastIndexOf(':')
  const hasTag   = colonIdx > 0
  const name     = hasTag ? image.slice(0, colonIdx) : image
  const tag      = hasTag ? image.slice(colonIdx) : null   // includes ':'

  return (
    <div style={{ fontSize: 7, fontFamily: '"JetBrains Mono", monospace', wordBreak: 'break-all', lineHeight: 1.4, color: '#ff4081' }}>
      {name}{tag}
    </div>
  )
}

function ServiceCard({ svc }: { svc: ServiceEntry }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '4px 6px', borderRadius: 4,
      background: svc.isContainer ? '#ff408108' : '#ffffff06',
      border: `1px solid ${svc.isContainer ? '#ff408125' : '#30363d'}`,
    }}>
      {svc.isContainer && (
        <span style={{ color: '#ff4081', flexShrink: 0 }}><Container size={10} /></span>
      )}
      <div style={{ flex: 1, minWidth: 0, fontFamily: '"JetBrains Mono", monospace' }}>
        <div style={{ fontSize: 10, color: '#e6edf3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {svc.name}
        </div>
        {svc.image && <ImageLabel image={svc.image} />}
        {svc.ip && (
          <div style={{ fontSize: 9, color: T.cyan }}>
            {svc.ip}
          </div>
        )}
      </div>
    </div>
  )
}

export const ServerNode = memo(function ServerNode({
  id, data, selected,
}: NodeProps<Node<ServerData>>) {
  const services: ServiceEntry[] = (data.services as ServiceEntry[] | undefined) ?? []

  return (
    <NodeBase id={id} nodeType="server" label={data.label} selected={selected}
      icon={<ServerIcon />} iconColor={T.amber} width={208}>
      <NodeBody>
        <NodeField label="IP"      value={data.ip}      valueColor={T.cyan} />
        <NodeField label="OS"      value={data.os} />
        {(data.ip || data.os) && (data.cpu || data.ram || data.storage) && <NodeDivider />}
        <NodeField label="CPU"     value={data.cpu} />
        <NodeField label="RAM"     value={data.ram}     valueColor={T.amber} />
        <NodeField label="Storage" value={data.storage} />

        {services.length > 0 && (
          <>
            <NodeDivider />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{
                fontSize: 9, color: T.textDim, textTransform: 'uppercase',
                letterSpacing: '0.08em', fontFamily: '"JetBrains Mono", monospace',
              }}>Services</span>
              <span style={{
                fontSize: 9, color: T.textDim, fontFamily: '"JetBrains Mono", monospace',
              }}>{services.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {services.map((svc) => (
                <ServiceCard key={svc.id} svc={svc} />
              ))}
            </div>
          </>
        )}
      </NodeBody>
    </NodeBase>
  )
})
