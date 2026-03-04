import { X, Settings, AlertTriangle } from "lucide-react"
import { useStore } from "@/store/useStore"
import { NODE_META } from "@/types"
import type { NodeType, BaseNodeData } from "@/types"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"
import { Separator } from "@/components/ui/Separator"
import { Badge } from "@/components/ui/Badge"

// ─── Field block per node type ────────────────────────────────────────────────

function RouterFields({ data, update }: FieldProps) {
  return (
    <>
      <Input label="IP / Loopback" value={data.ip ?? ""} placeholder="192.168.1.1"
        onChange={(e) => update({ ip: e.target.value })} />
      <Input label="Modèle" value={data.model ?? ""} placeholder="Cisco ISR 4431"
        onChange={(e) => update({ model: e.target.value })} />
    </>
  )
}

function SwitchFields({ data, update }: FieldProps) {
  return (
    <>
      <Input label="IP de management" value={data.ip ?? ""} placeholder="10.0.0.254"
        onChange={(e) => update({ ip: e.target.value })} />
      <Input label="Ports" value={data.ports ?? ""} placeholder="24"
        onChange={(e) => update({ ports: e.target.value })} />
      <Input label="VLAN tags" value={data.vlan ?? ""} placeholder="10,20,30"
        onChange={(e) => update({ vlan: e.target.value })} />
    </>
  )
}

function ServerFields({ data, update }: FieldProps) {
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

function ContainerFields({ data, update }: FieldProps) {
  return (
    <>
      <Input label="Image" value={data.image ?? ""} placeholder="nginx:alpine"
        onChange={(e) => update({ image: e.target.value })} />
      <Input label="Ports" value={data.ports ?? ""} placeholder="80:80, 443:443"
        onChange={(e) => update({ ports: e.target.value })} />
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
  return (
    <>
      <Input label="SSID" value={data.ssid ?? ""} placeholder="HomeNetwork"
        onChange={(e) => update({ ssid: e.target.value })} />
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

const FIELD_COMPONENTS: Record<NodeType, React.ComponentType<FieldProps>> = {
  router:    RouterFields,
  switch:    SwitchFields,
  server:    ServerFields,
  vm:        VMFields,
  container: ContainerFields,
  firewall:  FirewallFields,
  nas:       NASFields,
  cloud:     CloudFields,
  isp:       ISPFields,
  apwifi:    APWiFiFields,
  group:     GroupFields,
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
