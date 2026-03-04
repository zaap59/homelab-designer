import type { Node, Edge } from '@xyflow/react'

// ─── Node Types ────────────────────────────────────────────────────────────────

export type NodeType =
  | 'router'
  | 'switch'
  | 'server'
  | 'vm'
  | 'container'
  | 'firewall'
  | 'nas'
  | 'cloud'
  | 'isp'
  | 'apwifi'
  | 'group'

// ─── Edge Types ────────────────────────────────────────────────────────────────

export type EdgeType = 'ethernet' | 'fiber' | 'wifi' | 'vpn' | 'vlan'

export interface HLabEdgeData extends Record<string, unknown> {
  edgeType: EdgeType
  label?: string
  bandwidth?: string
  protocol?: string
  directed?: boolean
}

export const EDGE_META: Record<EdgeType, { label: string; color: string; strokeDasharray?: string; strokeWidth: number }> = {
  ethernet: { label: 'Ethernet', color: '#4fc3f7', strokeWidth: 2 },
  fiber:    { label: 'Fiber',    color: '#00e5ff', strokeWidth: 3 },
  wifi:     { label: 'WiFi',     color: '#69ff47', strokeWidth: 2, strokeDasharray: '6 3' },
  vpn:      { label: 'VPN',      color: '#e040fb', strokeWidth: 2, strokeDasharray: '8 4' },
  vlan:     { label: 'VLAN',     color: '#ffd740', strokeWidth: 2, strokeDasharray: '3 3' },
}

// ─── Per-Node Data Interfaces ──────────────────────────────────────────────────

export interface RouterData    extends Record<string, unknown> { nodeType: 'router';    label: string; ip?: string; model?: string; notes?: string }
export interface SwitchData    extends Record<string, unknown> { nodeType: 'switch';    label: string; ip?: string; ports?: string; vlan?: string; notes?: string }
export interface ServerData    extends Record<string, unknown> { nodeType: 'server';    label: string; ip?: string; os?: string; cpu?: string; ram?: string; notes?: string }
export interface VMData        extends Record<string, unknown> { nodeType: 'vm';        label: string; ip?: string; os?: string; hypervisor?: string; cpu?: string; ram?: string; notes?: string }
export interface ContainerData extends Record<string, unknown> { nodeType: 'container'; label: string; image?: string; ports?: string; notes?: string }
export interface FirewallData  extends Record<string, unknown> { nodeType: 'firewall';  label: string; ip?: string; rules?: string; notes?: string }
export interface NASData       extends Record<string, unknown> { nodeType: 'nas';       label: string; ip?: string; capacity?: string; protocol?: string; notes?: string }
export interface CloudData     extends Record<string, unknown> { nodeType: 'cloud';     label: string; provider?: string; service?: string; region?: string; notes?: string }
export interface ISPData       extends Record<string, unknown> { nodeType: 'isp';       label: string; ip?: string; asn?: string; uplink?: string; notes?: string }
export interface APWiFiData    extends Record<string, unknown> { nodeType: 'apwifi';    label: string; ip?: string; ssid?: string; band?: string; frequency?: string; notes?: string }
export interface GroupData     extends Record<string, unknown> { nodeType: 'group';     label: string; color?: string }

// ─── BaseNodeData (union of all fields) ───────────────────────────────────────

export interface BaseNodeData extends Record<string, unknown> {
  nodeType: NodeType; label: string
  ip?: string; os?: string; cpu?: string; ram?: string; model?: string; ports?: string
  vlan?: string; hypervisor?: string; image?: string; rules?: string; capacity?: string
  protocol?: string; provider?: string; service?: string; region?: string
  asn?: string; uplink?: string; ssid?: string; band?: string; frequency?: string
  color?: string; notes?: string
}

// ─── React Flow aliases ────────────────────────────────────────────────────────

export type HLabNode = Node<BaseNodeData>
export type HLabEdge = Edge<HLabEdgeData>

// ─── Diagram State ─────────────────────────────────────────────────────────────

export interface DiagramState {
  nodes: HLabNode[]; edges: HLabEdge[]; name: string
  version: string; createdAt: string; updatedAt: string
}

// ─── Sidebar sections ──────────────────────────────────────────────────────────

export interface SidebarSection { id: string; label: string; color: string; types: NodeType[] }

export const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: 'network', label: 'Réseau',   color: '#ff6b35', types: ['router', 'switch', 'firewall', 'isp', 'apwifi'] },
  { id: 'compute', label: 'Compute',  color: '#7c4dff', types: ['server', 'vm', 'container'] },
  { id: 'storage', label: 'Stockage', color: '#ffd740', types: ['nas'] },
  { id: 'cloud',   label: 'Cloud',    color: '#40c4ff', types: ['cloud'] },
  { id: 'layout',  label: 'Layout',   color: '#30363d', types: ['group'] },
]

// ─── Node Metadata ─────────────────────────────────────────────────────────────

export const NODE_META: Record<NodeType, { label: string; color: string; description: string }> = {
  router:    { label: 'Router',    color: '#ff6b35', description: 'Layer 3 routing device' },
  switch:    { label: 'Switch',    color: '#4fc3f7', description: 'Layer 2/3 network switch' },
  server:    { label: 'Server',    color: '#7c4dff', description: 'Physical host / bare metal' },
  vm:        { label: 'VM',        color: '#00e676', description: 'Hypervisor guest' },
  container: { label: 'Container', color: '#ff4081', description: 'Docker / Podman container' },
  firewall:  { label: 'Firewall',  color: '#ff9100', description: 'Security enforcement layer' },
  nas:       { label: 'NAS',       color: '#ffd740', description: 'Network attached storage' },
  cloud:     { label: 'Cloud',     color: '#40c4ff', description: 'External cloud provider' },
  isp:       { label: 'ISP',       color: '#e040fb', description: 'Internet Service Provider' },
  apwifi:    { label: 'AP WiFi',   color: '#69ff47', description: 'Wireless access point' },
  group:     { label: 'Group',     color: '#30363d', description: 'Visual group / zone' },
}
