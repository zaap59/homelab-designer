import { create } from 'zustand'
import { toast } from '@/lib/toast'
import {
  addEdge as rfAddEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react'
import type { HLabNode, HLabEdge, HLabEdgeData, NodeType, EdgeType, DiagramState } from '@/types'

// ─── History snapshot ─────────────────────────────────────────────────────────

interface Snapshot { nodes: HLabNode[]; edges: HLabEdge[] }
const snap = (s: { nodes: HLabNode[]; edges: HLabEdge[] }): Snapshot => ({
  nodes: s.nodes, edges: s.edges,
})

// ─── Store interface ──────────────────────────────────────────────────────────

export interface StoreState {
  nodes: HLabNode[]
  edges: HLabEdge[]
  projectName: string
  selectedNodeId: string | null
  selectedEdgeId: string | null
  clipboard: HLabNode[]
  snapToGrid: boolean
  theme: 'dark' | 'light'
  past: Snapshot[]
  future: Snapshot[]

  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void

  addNode: (type: NodeType, position: { x: number; y: number }) => void
  updateNodeData: (id: string, data: Partial<HLabNode['data']>) => void
  deleteNode: (id: string) => void
  deleteSelected: () => void
  setSelectedNode: (id: string | null) => void

  updateEdgeData: (id: string, data: Partial<HLabEdgeData>) => void
  deleteEdge: (id: string) => void
  setSelectedEdge: (id: string | null) => void

  copySelected: () => void
  paste: (offset?: { x: number; y: number }) => void
  checkpoint: () => void
  undo: () => void
  redo: () => void

  setProjectName: (name: string) => void
  toggleSnapToGrid: () => void
  toggleTheme: () => void
  clearDiagram: () => void
  saveDiagram: () => void
  loadFromStorage: () => void
  exportDiagram: () => void
  importDiagram: (json: string) => void
}

// ─── Drag tracking (for checkpoint-on-drag-start) ────────────────────────────
let _dragging = false

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DEFAULT_LABELS: Record<NodeType, string> = {
  router: 'router-01', switch: 'sw-core-01', server: 'srv-01', vm: 'vm-01',
  container: 'nginx-01', firewall: 'fw-edge-01', nas: 'nas-01', cloud: 'cloud-01',
  isp: 'isp-provider', apwifi: 'ap-wifi-01', group: 'VLAN 10', camera: 'cam-01',
}
let _nc = 1
const genId = (prefix = 'node') => `${prefix}-${Date.now()}-${_nc++}`

// ─── Store ────────────────────────────────────────────────────────────────────

export const useStore = create<StoreState>((set, get) => ({
  nodes: [],
  edges: [],
  projectName: 'My HomeLab',
  selectedNodeId: null,
  selectedEdgeId: null,
  clipboard: [],
  snapToGrid: true,
  theme: 'dark',
  past: [],
  future: [],

  // ── React Flow handlers ───────────────────────────────────────────────────

  onNodesChange: (changes) => {
    const isDragStart = changes.some(
      (c) => c.type === 'position' && (c as { dragging?: boolean }).dragging === true,
    )
    const isDragEnd = changes.some(
      (c) => c.type === 'position' && (c as { dragging?: boolean }).dragging === false,
    )
    // Checkpoint once at the very start of a drag, before any position is modified
    if (isDragStart && !_dragging) {
      _dragging = true
      get().checkpoint()
    }
    if (isDragEnd) _dragging = false
    set((s) => ({ nodes: applyNodeChanges(changes, s.nodes) as HLabNode[] }))
  },

  onEdgesChange: (changes) =>
    set((s) => ({ edges: applyEdgeChanges(changes, s.edges) as HLabEdge[] })),

  onConnect: (connection) => {
    get().checkpoint()
    set((s) => ({
      edges: rfAddEdge(
        {
          ...connection,
          id: genId('edge'),
          type: 'hlab',
          data: { edgeType: 'ethernet' as EdgeType },
          animated: false,
        },
        s.edges,
      ) as HLabEdge[],
    }))
  },

  // ── Node operations ───────────────────────────────────────────────────────

  addNode: (type, position) => {
    get().checkpoint()
    const newNode: HLabNode = {
      id: genId(),
      type,
      position,
      data: { nodeType: type, label: DEFAULT_LABELS[type] },
      ...(type === 'group' ? { style: { width: 240, height: 160, zIndex: -1 } } : {}),
    }
    set((s) => ({ nodes: [...s.nodes, newNode] }))
  },

  updateNodeData: (id, data) =>
    set((s) => ({
      nodes: s.nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, ...data } } : n),
    })),

  deleteNode: (id) => {
    get().checkpoint()
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== id),
      edges: s.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
    }))
  },

  deleteSelected: () => {
    const { selectedNodeId, selectedEdgeId } = get()
    if (selectedNodeId) get().deleteNode(selectedNodeId)
    else if (selectedEdgeId) get().deleteEdge(selectedEdgeId)
  },

  setSelectedNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),

  // ── Edge operations ───────────────────────────────────────────────────────

  updateEdgeData: (id, data) =>
    set((s) => ({
      edges: s.edges.map((e) =>
        e.id === id ? { ...e, data: { ...e.data, ...data } as HLabEdgeData } : e,
      ),
    })),

  deleteEdge: (id) => {
    get().checkpoint()
    set((s) => ({
      edges: s.edges.filter((e) => e.id !== id),
      selectedEdgeId: s.selectedEdgeId === id ? null : s.selectedEdgeId,
    }))
  },

  setSelectedEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),

  // ── Copy / paste ──────────────────────────────────────────────────────────

  copySelected: () => {
    const { nodes, selectedNodeId } = get()
    const node = nodes.find((n) => n.id === selectedNodeId)
    if (node) set({ clipboard: [node] })
  },

  paste: (offset = { x: 32, y: 32 }) => {
    const { clipboard } = get()
    if (clipboard.length === 0) return
    get().checkpoint()
    const newNodes: HLabNode[] = clipboard.map((n) => ({
      ...n,
      id: genId(),
      position: { x: n.position.x + offset.x, y: n.position.y + offset.y },
      selected: false,
    }))
    set((s) => ({ nodes: [...s.nodes, ...newNodes] }))
  },

  // ── Undo / redo ───────────────────────────────────────────────────────────

  checkpoint: () => {
    const s = get()
    set({ past: [...s.past.slice(-49), snap(s)], future: [] })
  },

  undo: () => {
    const { past, future } = get()
    if (past.length === 0) return
    const prev = past[past.length - 1]
    const current = snap(get())
    set({
      nodes: prev.nodes, edges: prev.edges,
      past: past.slice(0, -1),
      future: [current, ...future.slice(0, 49)],
      selectedNodeId: null, selectedEdgeId: null,
    })
  },

  redo: () => {
    const { past, future } = get()
    if (future.length === 0) return
    const next = future[0]
    const current = snap(get())
    set({
      nodes: next.nodes, edges: next.edges,
      past: [...past.slice(-49), current],
      future: future.slice(1),
      selectedNodeId: null, selectedEdgeId: null,
    })
  },

  // ── Project ───────────────────────────────────────────────────────────────

  setProjectName: (name) => set({ projectName: name }),
  toggleSnapToGrid: () => set((s) => ({ snapToGrid: !s.snapToGrid })),
  toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

  clearDiagram: () => {
    get().checkpoint()
    set({ nodes: [], edges: [], selectedNodeId: null, selectedEdgeId: null })
  },

  saveDiagram: () => {
    const { nodes, edges, projectName } = get()
    const now = new Date().toISOString()
    const state: DiagramState = {
      nodes, edges, name: projectName, version: '1.1.0',
      createdAt: now, updatedAt: now,
      nodeCount: nodes.length, edgeCount: edges.length,
    }
    localStorage.setItem('homelab-designer:diagram', JSON.stringify(state))
    toast('Diagramme sauvegardé', 'success')
  },

  loadFromStorage: () => {
    const raw = localStorage.getItem('homelab-designer:diagram')
    if (raw) get().importDiagram(raw)
  },

  exportDiagram: () => {
    const { nodes, edges, projectName } = get()
    const now = new Date().toISOString()
    const state: DiagramState = {
      nodes, edges, name: projectName, version: '1.1.0',
      createdAt: now, updatedAt: now,
      nodeCount: nodes.length, edgeCount: edges.length,
      tags: [],
    }
    const json = JSON.stringify(state, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const slug = projectName.replace(/\s+/g, '-').toLowerCase()
    a.href = url; a.download = `${slug}.hlab.json`; a.click()
    URL.revokeObjectURL(url)
    toast(`Export JSON — ${projectName} (${nodes.length}n / ${edges.length}e)`, 'info')
  },

  importDiagram: (json) => {
    try {
      const state: DiagramState = JSON.parse(json)
      set({ nodes: state.nodes ?? [], edges: state.edges ?? [], projectName: state.name ?? 'Imported', selectedNodeId: null, selectedEdgeId: null, past: [], future: [] })
      toast(`Import : ${state.name ?? 'Imported'} (${(state.nodes ?? []).length} nœuds)`, 'success')
    } catch {
      console.error('Invalid diagram JSON')
      toast('Fichier JSON invalide', 'error')
    }
  },
}))
