import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ReactFlow,
  Controls,
  MiniMap,
  useReactFlow,
  type NodeMouseHandler,
  type EdgeMouseHandler,
} from '@xyflow/react'
import { useStore } from '@/store/useStore'
import { nodeTypes } from '@/components/nodes'
import { edgeTypes, EdgeEditModal } from '@/components/edges'
import type { NodeType } from '@/types'
import { NODE_META } from '@/types'

function SvgDefs() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        <marker id="hlab-arrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#8b949e" />
        </marker>
      </defs>
    </svg>
  )
}

function EmptyState() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
      <div className="flex flex-col items-center gap-3" style={{ opacity: 0.18 }}>
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="20" width="48" height="30" rx="3" stroke="#00e5ff" strokeWidth="1.5" strokeDasharray="4 3" />
          <rect x="14" y="26" width="12" height="8" rx="2" fill="#00e5ff" fillOpacity="0.3" stroke="#00e5ff" strokeWidth="1" />
          <rect x="30" y="26" width="12" height="8" rx="2" fill="#7c4dff" fillOpacity="0.3" stroke="#7c4dff" strokeWidth="1" />
          <rect x="22" y="40" width="20" height="4" rx="1" fill="#3fb950" fillOpacity="0.3" stroke="#3fb950" strokeWidth="1" />
          <circle cx="32" cy="14" r="4" stroke="#00e5ff" strokeWidth="1.5" />
          <line x1="32" y1="18" x2="32" y2="20" stroke="#00e5ff" strokeWidth="1.5" />
        </svg>
        <p style={{ fontSize: 10, color: '#484f58', textAlign: 'center', lineHeight: 1.6, fontFamily: '"JetBrains Mono", monospace' }}>
          Glisser un composant depuis la sidebar<br />pour commencer
        </p>
      </div>
    </div>
  )
}

function CanvasInner() {
  const nodes           = useStore((s) => s.nodes)
  const edges           = useStore((s) => s.edges)
  const onNodesChange   = useStore((s) => s.onNodesChange)
  const onEdgesChange   = useStore((s) => s.onEdgesChange)
  const onConnect       = useStore((s) => s.onConnect)
  const addNode         = useStore((s) => s.addNode)
  const setSelectedNode = useStore((s) => s.setSelectedNode)
  const setSelectedEdge = useStore((s) => s.setSelectedEdge)
  const deleteSelected  = useStore((s) => s.deleteSelected)
  const copySelected    = useStore((s) => s.copySelected)
  const paste           = useStore((s) => s.paste)
  const snapToGrid      = useStore((s) => s.snapToGrid)
  const theme           = useStore((s) => s.theme)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const { screenToFlowPosition } = useReactFlow()

  const onNodeClick: NodeMouseHandler = useCallback((_e, node) => setSelectedNode(node.id), [setSelectedNode])
  const onEdgeClick: EdgeMouseHandler = useCallback((_e, edge) => setSelectedEdge(edge.id), [setSelectedEdge])
  const onPaneClick  = useCallback(() => { setSelectedNode(null); setSelectedEdge(null) }, [setSelectedNode, setSelectedEdge])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey
      const tag  = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'Escape')                        { setSelectedNode(null); setSelectedEdge(null) }
      if (e.key === 'Delete' || e.key === 'Backspace') deleteSelected()
      if (meta && e.key === 'c')                     { e.preventDefault(); copySelected() }
      if (meta && e.key === 'v')                     { e.preventDefault(); paste() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setSelectedNode, setSelectedEdge, deleteSelected, copySelected, paste])

  const onDragOver  = useCallback((e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; setIsDragOver(true) }, [])
  const onDragLeave = useCallback(() => setIsDragOver(false), [])
  const onDrop      = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragOver(false)
    const nodeType = e.dataTransfer.getData('application/homelab-node-type') as NodeType
    if (!nodeType || !NODE_META[nodeType]) return
    addNode(nodeType, screenToFlowPosition({ x: e.clientX, y: e.clientY }))
  }, [screenToFlowPosition, addNode])

  return (
    <div ref={wrapperRef} className="flex-1 relative overflow-hidden hlab-canvas-bg"
      style={{ outline: isDragOver ? '2px inset rgba(0,229,255,0.3)' : 'none' }}
    >
      <SvgDefs />
      {nodes.length === 0 && <EmptyState />}
      <EdgeEditModal />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid={snapToGrid}
        snapGrid={[16, 16]}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        multiSelectionKeyCode="Shift"
        selectionKeyCode="Shift"
        panOnScroll
        panOnDrag={[1, 2]}
        zoomOnDoubleClick={false}
        minZoom={0.1}
        maxZoom={4}
        deleteKeyCode={null}
        defaultEdgeOptions={{ type: 'hlab', data: { edgeType: 'ethernet' } }}
        proOptions={{ hideAttribution: true }}
        colorMode={theme}
      >
        <Controls style={{ bottom: 100, left: 12 }} showZoom={false} showFitView={false} />
        <MiniMap
          style={{ bottom: 12, right: 12, width: 140, height: 90, border: '1px solid #21262d' }}
          nodeColor={(node) => NODE_META[(node.data as { nodeType?: NodeType })?.nodeType ?? 'router']?.color ?? '#30363d'}
          maskColor="rgba(8,12,16,0.75)"
          pannable zoomable
        />
      </ReactFlow>
    </div>
  )
}

export function Canvas() {
  return <CanvasInner />
}
