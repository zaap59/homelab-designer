import { useState } from "react"
import { X, Settings, AlertTriangle, Plus, Minus, Pencil, Check, Container } from "lucide-react"
import { useStore } from "@/store/useStore"
import { NODE_META } from "@/types"
import type { NodeType, BaseNodeData } from "@/types"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"
import { Separator } from "@/components/ui/Separator"
import { Badge } from "@/components/ui/Badge"

// ─── Field block per node type ────────────────────────────────────────────────

/** Spinner for numeric port counts */
function PortSpinner({ label, value, min, max, onChange }: {
  label: string; value: number; min: number; max: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] text-[#8b949e]">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex items-center justify-center w-6 h-6 rounded border border-[#30363d]
            bg-[#161b22] text-[#8b949e] hover:text-[#e6edf3] hover:border-[#484f58]
            disabled:opacity-30 transition-colors"
        >
          <Minus size={10} />
        </button>
        <span className="text-[13px] font-mono text-[#e6edf3] w-6 text-center">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="flex items-center justify-center w-6 h-6 rounded border border-[#30363d]
            bg-[#161b22] text-[#8b949e] hover:text-[#e6edf3] hover:border-[#484f58]
            disabled:opacity-30 transition-colors"
        >
          <Plus size={10} />
        </button>
        {/* Mini port preview */}
        <div className="flex flex-wrap gap-[3px] ml-2">
          {Array.from({ length: Math.min(value, 24) }, (_, i) => (
            <div
              key={i}
              className="w-[8px] h-[6px] rounded-sm bg-[#0d1117] border border-[#30363d]"
            />
          ))}
          {value > 24 && (
            <span className="text-[9px] text-[#484f58] self-center">+{value - 24}</span>
          )}
        </div>
      </div>
    </div>
  )
}

function RouterFields({ data, update }: FieldProps) {
  const portCount = (data.portCount as number) ?? 5
  return (
    <>
      <Input label="IP / Loopback" value={data.ip ?? ""} placeholder="192.168.1.1"
        onChange={(e) => update({ ip: e.target.value })} />
      <Input label="WAN IP" value={(data.wanIp as string) ?? ""} placeholder="203.0.113.1"
        onChange={(e) => update({ wanIp: e.target.value })} />
      <Input label="LAN IP" value={(data.lanIp as string) ?? ""} placeholder="192.168.1.1"
        onChange={(e) => update({ lanIp: e.target.value })} />
      <Input label="Modèle" value={data.model ?? ""} placeholder="Cisco ISR 4431"
        onChange={(e) => update({ model: e.target.value })} />
      <PortSpinner label="Ports LAN" value={portCount} min={1} max={12}
        onChange={(v) => update({ portCount: v, connectedPorts: [] })} />
    </>
  )
}

function SwitchFields({ data, update }: FieldProps) {
  return (
    <>
      <Input label="IP de management" value={data.ip ?? ""} placeholder="10.0.0.254"
        onChange={(e) => update({ ip: e.target.value })} />
      <Input label="Modèle" value={data.model ?? ""} placeholder="Cisco Catalyst 2960"
        onChange={(e) => update({ model: e.target.value })} />
      <Input label="VLAN tags" value={data.vlan ?? ""} placeholder="10,20,30"
        onChange={(e) => update({ vlan: e.target.value })} />
      <Input label="Vitesse" value={(data.speed as string) ?? ""} placeholder="1G"
        onChange={(e) => update({ speed: e.target.value })} />
    </>
  )
}

type ServiceDraft = { name: string; image: string; ip: string; isContainer: boolean }
const EMPTY_DRAFT: ServiceDraft = { name: '', image: '', ip: '', isContainer: false }

function ServiceForm({
  initial, onSave, onCancel, saveLabel,
}: {
  initial: ServiceDraft
  onSave: (d: ServiceDraft) => void
  onCancel?: () => void
  saveLabel: string
}) {
  const [d, setD] = useState<ServiceDraft>(initial)
  const valid = d.name.trim().length > 0
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Input label="Nom" value={d.name} placeholder="nginx"
        onChange={(e) => setD((p) => ({ ...p, name: e.target.value }))} />
      <Input label="Image" value={d.image} placeholder="nginx:alpine"
        onChange={(e) => setD((p) => ({ ...p, image: e.target.value }))} />
      <Input label="IP" value={d.ip} placeholder="172.17.0.2"
        onChange={(e) => setD((p) => ({ ...p, ip: e.target.value }))} />
      <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
        <input type="checkbox" checked={d.isContainer} onChange={(e) => setD((p) => ({ ...p, isContainer: e.target.checked }))}
          style={{ accentColor: '#ff4081', cursor: 'pointer' }} />
        <span style={{ fontSize: 11, color: '#8b949e', fontFamily: '"JetBrains Mono", monospace' }}>Container</span>
      </label>
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={() => { if (valid) onSave(d) }} disabled={!valid} style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
          padding: '5px 0', borderRadius: 4, cursor: valid ? 'pointer' : 'not-allowed',
          border: `1px solid ${valid ? '#ff408140' : '#30363d'}`,
          background: valid ? '#ff408115' : 'transparent',
          color: valid ? '#ff4081' : '#484f58',
          fontSize: 11, fontFamily: '"JetBrains Mono", monospace', transition: 'all 0.1s',
        }}>
          <Check size={10} /> {saveLabel}
        </button>
        {onCancel && (
          <button onClick={onCancel} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '5px 10px', borderRadius: 4, cursor: 'pointer',
            border: '1px solid #30363d', background: 'transparent',
            color: '#484f58', fontSize: 11, fontFamily: '"JetBrains Mono", monospace',
          }}>
            <X size={10} />
          </button>
        )}
      </div>
    </div>
  )
}

function ServerFields({ data, update }: FieldProps) {
  const services = (data.services as import('@/types').ServiceEntry[] | undefined) ?? []
  const [editingId, setEditingId] = useState<string | null>(null)

  const addService = (d: ServiceDraft) => {
    const entry: import('@/types').ServiceEntry = {
      id: `svc-${Date.now()}`,
      name: d.name.trim(),
      image: d.image.trim() || undefined,
      ip: d.ip.trim() || undefined,
      isContainer: d.isContainer || undefined,
    }
    update({ services: [...services, entry] })
  }

  const saveEdit = (id: string, d: ServiceDraft) => {
    update({
      services: services.map((s) => s.id !== id ? s : {
        ...s,
        name: d.name.trim(),
        image: d.image.trim() || undefined,
        ip: d.ip.trim() || undefined,
        isContainer: d.isContainer || undefined,
      }),
    })
    setEditingId(null)
  }

  const removeService = (id: string) => {
    update({ services: services.filter((s) => s.id !== id) })
    if (editingId === id) setEditingId(null)
  }

  return (
    <>
      <Input label="IP" value={data.ip ?? ""} placeholder="10.0.1.10"
        onChange={(e) => update({ ip: e.target.value })} />
      <Input label="OS" value={data.os ?? ""} placeholder="Proxmox VE 8.2"
        onChange={(e) => update({ os: e.target.value })} />
      <Input label="CPU" value={data.cpu ?? ""} placeholder="Intel Xeon E5-2667"
        onChange={(e) => update({ cpu: e.target.value })} />
      <Input label="RAM" value={data.ram ?? ""} placeholder="64 GB"
        onChange={(e) => update({ ram: e.target.value })} />

      {/* ── Services ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
        <div style={{ fontSize: 11, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Services</div>

        {services.map((svc) => (
          <div key={svc.id} style={{
            borderRadius: 5, border: '1px solid #21262d', background: '#0d1117', overflow: 'hidden',
          }}>
            {editingId === svc.id ? (
              <div style={{ padding: 8 }}>
                <ServiceForm
                  initial={{ name: svc.name, image: svc.image ?? '', ip: svc.ip ?? '', isContainer: svc.isContainer ?? false }}
                  onSave={(d) => saveEdit(svc.id, d)}
                  onCancel={() => setEditingId(null)}
                  saveLabel="Sauvegarder"
                />
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px' }}>
                <div style={{ flex: 1, minWidth: 0, fontFamily: '"JetBrains Mono", monospace' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    {svc.isContainer && <Container size={10} style={{ color: '#ff4081', flexShrink: 0 }} />}
                    <span style={{ fontSize: 11, color: '#e6edf3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{svc.name}</span>
                  </div>
                  {svc.image && <div style={{ fontSize: 10, color: '#ff4081', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{svc.image}</div>}
                  {svc.ip    && <div style={{ fontSize: 10, color: '#4fc3f7' }}>{svc.ip}</div>}
                </div>
                <button onClick={() => setEditingId(svc.id)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', color: '#484f58',
                  padding: 2, display: 'flex', alignItems: 'center', flexShrink: 0,
                }}>
                  <Pencil size={10} />
                </button>
                <button onClick={() => removeService(svc.id)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', color: '#484f58',
                  padding: 2, display: 'flex', alignItems: 'center', flexShrink: 0,
                }}>
                  <X size={10} />
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Add new service */}
        <div style={{ padding: 8, borderRadius: 5, border: '1px dashed #30363d', background: '#0d1117' }}>
          <ServiceForm initial={EMPTY_DRAFT} onSave={addService} saveLabel="Ajouter" />
        </div>
      </div>
    </>
  )
}

function VMFields({ data, update }: FieldProps) {
  return (
    <>
      <Input label="IP" value={data.ip ?? ""} placeholder="10.0.1.20"
        onChange={(e) => update({ ip: e.target.value })} />
      <Input label="OS" value={data.os ?? ""} placeholder="Ubuntu 24.04"
        onChange={(e) => update({ os: e.target.value })} />
      <Select label="Hyperviseur"
        value={data.hypervisor ?? ""}
        onChange={(e) => update({ hypervisor: e.target.value })}
        options={[
          { value: "Proxmox", label: "Proxmox" },
          { value: "VMware ESXi", label: "VMware ESXi" },
          { value: "Hyper-V", label: "Hyper-V" },
          { value: "KVM", label: "KVM" },
          { value: "VirtualBox", label: "VirtualBox" },
        ]}
      />
      <div className="grid grid-cols-2 gap-2">
        <Input label="vCPU" value={data.cpu ?? ""} placeholder="4"
          onChange={(e) => update({ cpu: e.target.value })} />
        <Input label="RAM" value={data.ram ?? ""} placeholder="8 GB"
          onChange={(e) => update({ ram: e.target.value })} />
      </div>
    </>
  )
}

function FirewallFields({ data, update }: FieldProps) {
  return (
    <>
      <Input label="IP" value={data.ip ?? ""} placeholder="192.168.0.1"
        onChange={(e) => update({ ip: e.target.value })} />
      <Input label="Règles" value={data.rules ?? ""} placeholder="Nombre de règles"
        onChange={(e) => update({ rules: e.target.value })} />
    </>
  )
}

function NASFields({ data, update }: FieldProps) {
  return (
    <>
      <Input label="IP" value={data.ip ?? ""} placeholder="10.0.1.50"
        onChange={(e) => update({ ip: e.target.value })} />
      <Input label="Capacité" value={data.capacity ?? ""} placeholder="16 TB"
        onChange={(e) => update({ capacity: e.target.value })} />
      <Select label="Protocole"
        value={data.protocol ?? ""}
        onChange={(e) => update({ protocol: e.target.value })}
        options={[
          { value: "NFS", label: "NFS" },
          { value: "SMB", label: "SMB / CIFS" },
          { value: "iSCSI", label: "iSCSI" },
          { value: "S3", label: "S3 (MinIO)" },
          { value: "NFS+SMB", label: "NFS + SMB" },
        ]}
      />
    </>
  )
}

function CloudFields({ data, update }: FieldProps) {
  return (
    <>
      <Select label="Provider"
        value={data.provider ?? ""}
        onChange={(e) => update({ provider: e.target.value })}
        options={[
          { value: "AWS", label: "AWS" },
          { value: "GCP", label: "Google Cloud" },
          { value: "Azure", label: "Microsoft Azure" },
          { value: "Cloudflare", label: "Cloudflare" },
          { value: "Hetzner", label: "Hetzner" },
          { value: "OVH", label: "OVH" },
          { value: "DigitalOcean", label: "DigitalOcean" },
        ]}
      />
      <Input label="Service" value={data.service ?? ""} placeholder="EC2, S3, GKE…"
        onChange={(e) => update({ service: e.target.value })} />
      <Input label="Région" value={data.region ?? ""} placeholder="eu-west-1"
        onChange={(e) => update({ region: e.target.value })} />
    </>
  )
}

// ─── Field map ────────────────────────────────────────────────────────────────

interface FieldProps {
  data: BaseNodeData
  update: (patch: Partial<BaseNodeData>) => void
}

function ISPFields({ data, update }: FieldProps) {
  return (
    <>
      <Input label="IP publique" value={data.ip ?? ""} placeholder="203.0.113.1"
        onChange={(e) => update({ ip: e.target.value })} />
      <Input label="ASN" value={data.asn ?? ""} placeholder="AS12345"
        onChange={(e) => update({ asn: e.target.value })} />
      <Input label="Débit montant" value={data.uplink ?? ""} placeholder="1 Gbps"
        onChange={(e) => update({ uplink: e.target.value })} />
    </>
  )
}

function APWiFiFields({ data, update }: FieldProps) {
  const ssids = (data.ssids as string[]) ?? []
  const [draft, setDraft] = useState('')
  const [focused, setFocused] = useState(false)

  const selectedNodeId = useStore((s) => s.selectedNodeId)
  const allNodes = useStore((s) => s.nodes)

  // SSIDs des autres nodes wifi, pas encore dans la liste courante
  const suggestions = [...new Set(
    allNodes
      .filter((n) => n.id !== selectedNodeId && n.data.nodeType === 'apwifi')
      .flatMap((n) => (n.data.ssids as string[] | undefined) ?? [])
      .filter((s) => !ssids.includes(s))
  )].filter((s) => s.toLowerCase().includes(draft.toLowerCase()))

  const addSsid = (value = draft) => {
    const trimmed = value.trim()
    if (!trimmed || ssids.includes(trimmed)) return
    update({ ssids: [...ssids, trimmed] })
    setDraft('')
  }

  const removeSsid = (s: string) =>
    update({ ssids: ssids.filter((x) => x !== s) })

  return (
    <>
      <Input label="IP de management" value={data.ip ?? ""} placeholder="192.168.1.2"
        onChange={(e) => update({ ip: e.target.value })} />
      <Select label="Bande"
        value={data.band ?? ""}
        onChange={(e) => update({ band: e.target.value })}
        options={[
          { value: "2.4 GHz", label: "2.4 GHz" },
          { value: "5 GHz",   label: "5 GHz" },
          { value: "6 GHz",   label: "6 GHz (WiFi 6E)" },
          { value: "Tri-band",label: "Tri-band" },
        ]}
      />
      <Input label="Fréquence / Canal" value={data.frequency ?? ""} placeholder="ch6 / 2.437 GHz"
        onChange={(e) => update({ frequency: e.target.value })} />
      <div className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-widest text-[#484f58] font-semibold">SSIDs</span>
        {ssids.map((s) => (
          <div key={s} className="flex items-center justify-between px-2 py-1 rounded border border-[#21262d] bg-[#0d1117]">
            <span className="text-[11px] text-[#c9d1d9] font-mono truncate">{s}</span>
            <button onClick={() => removeSsid(s)} className="text-[#484f58] hover:text-[#f85149] ml-2 shrink-0">
              <X size={10} />
            </button>
          </div>
        ))}
        <div className="relative flex gap-1">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSsid()}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 100)}
            placeholder="Ajouter un SSID…"
            className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-2 py-1.5
              text-[11px] text-[#c9d1d9] placeholder:text-[#484f58] outline-none
              focus:border-[#58a6ff] font-mono"
          />
          <button
            onClick={() => addSsid()}
            className="flex items-center justify-center w-7 h-7 rounded border border-[#30363d]
              bg-[#161b22] text-[#8b949e] hover:text-[#e6edf3] hover:border-[#484f58] transition-colors"
          >
            <Plus size={11} />
          </button>
          {focused && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-8 mt-1 z-50 rounded border border-[#30363d] bg-[#161b22] overflow-hidden">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onMouseDown={() => addSsid(s)}
                  className="w-full text-left px-2 py-1.5 text-[11px] font-mono text-[#8b949e]
                    hover:bg-[#21262d] hover:text-[#e6edf3] transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function GroupFields({ data, update }: FieldProps) {
  return (
    <>
      <Input label="Nom du groupe" value={data.label ?? ""} placeholder="VLAN 10, DMZ..."
        onChange={(e) => update({ label: e.target.value })} />
    </>
  )
}

function CameraFields({ data, update }: FieldProps) {
  return (
    <>
      <Input label="IP" value={data.ip ?? ""} placeholder="192.168.1.x"
        onChange={(e) => update({ ip: e.target.value })} />
      <Input label="Emplacement" value={data.location ?? ""} placeholder="Entrée, couloir..."
        onChange={(e) => update({ location: e.target.value })} />
      <Input label="Résolution" value={data.resolution ?? ""} placeholder="1080p, 4K..."
        onChange={(e) => update({ resolution: e.target.value })} />
      <Input label="Protocole" value={data.protocol ?? ""} placeholder="RTSP, ONVIF..."
        onChange={(e) => update({ protocol: e.target.value })} />
      <div className="flex flex-col gap-1.5">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={!!(data.ptz)} onChange={(e) => update({ ptz: e.target.checked })}
            className="w-3.5 h-3.5 accent-[#ffaa00]" />
          <span className="text-[11px] uppercase tracking-widest text-[#8b949e] font-semibold">PTZ</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={!!(data.outdoor)} onChange={(e) => update({ outdoor: e.target.checked })}
            className="w-3.5 h-3.5 accent-[#39ff14]" />
          <span className="text-[11px] uppercase tracking-widest text-[#8b949e] font-semibold">Outdoor</span>
        </label>
      </div>
    </>
  )
}

const FIELD_COMPONENTS: Record<NodeType, React.ComponentType<FieldProps>> = {
  router:    RouterFields,
  switch:    SwitchFields,
  server:    ServerFields,
  vm:        VMFields,
  firewall:  FirewallFields,
  nas:       NASFields,
  cloud:     CloudFields,
  isp:       ISPFields,
  apwifi:    APWiFiFields,
  group:     GroupFields,
  camera:    CameraFields,
}

// ─── PropertiesPanel ──────────────────────────────────────────────────────────

export function PropertiesPanel() {
  const selectedNodeId = useStore((s) => s.selectedNodeId)
  const nodes = useStore((s) => s.nodes)
  const updateNodeData = useStore((s) => s.updateNodeData)
  const setSelectedNode = useStore((s) => s.setSelectedNode)

  const node = nodes.find((n) => n.id === selectedNodeId)
  if (!node) return null

  const data = node.data
  const meta = NODE_META[data.nodeType]
  const FieldsComponent = FIELD_COMPONENTS[data.nodeType]
  const update = (patch: Partial<BaseNodeData>) =>
    updateNodeData(node.id, patch)

  // IP conflict detection
  const ipConflicts = data.ip
    ? nodes.filter((n) => n.id !== selectedNodeId && n.data.ip && n.data.ip.trim() === data.ip!.trim())
    : []

  return (
    <aside
      className="flex flex-col w-[260px] shrink-0 h-full border-l border-[#21262d] overflow-hidden"
      style={{ background: "#0d1117" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#21262d]">
        <div
          className="flex items-center justify-center w-8 h-8 rounded shrink-0"
          style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}35` }}
        >
          <Settings size={15} style={{ color: meta.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold text-[#e6edf3] truncate">{data.label}</div>
          <div className="flex items-center gap-1 mt-0.5">
            <Badge color={meta.color}>{meta.label}</Badge>
          </div>
        </div>
        <button
          onClick={() => setSelectedNode(null)}
          className="text-[#484f58] hover:text-[#8b949e] transition-colors shrink-0"
        >
          <X size={14} />
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        <div className="space-y-2.5">
          <div className="text-[11px] uppercase tracking-widest text-[#484f58] font-semibold px-0.5">
            Identité
          </div>
          <Input
            label="Nom"
            value={data.label}
            onChange={(e) => update({ label: e.target.value })}
          />
        </div>

        <Separator />

        <div className="space-y-2.5">
          <div className="text-[11px] uppercase tracking-widest text-[#484f58] font-semibold px-0.5">
            Propriétés
          </div>
          <FieldsComponent data={data} update={update} />
          {ipConflicts.length > 0 && (
            <div className="flex items-start gap-2 px-2.5 py-2 rounded border text-[11px]"
              style={{ background: '#d2992214', borderColor: '#d2992240', color: '#d29922' }}>
              <AlertTriangle size={12} className="mt-0.5 shrink-0" />
              <span>
                IP en conflit avec :{' '}
                <strong>{ipConflicts.map((n) => n.data.label).join(', ')}</strong>
              </span>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-2.5">
          <div className="text-[11px] uppercase tracking-widest text-[#484f58] font-semibold px-0.5">
            Notes
          </div>
          <Textarea
            placeholder="Description, configuration, liens…"
            value={data.notes ?? ""}
            onChange={(e) => update({ notes: e.target.value })}
          />
        </div>
      </div>

      {/* Footer: node id */}
      <div className="px-4 py-2.5 border-t border-[#21262d]">
        <div className="text-[10px] text-[#30363d] font-mono truncate">{node.id}</div>
      </div>
    </aside>
  )
}
