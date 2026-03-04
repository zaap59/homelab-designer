import { useRef, useState, useEffect, useCallback } from 'react'
import { Save, Download, Upload, Trash2, Undo2, Redo2, ZoomIn, ZoomOut, Maximize2, Grid3X3, Sun, Moon, GitBranch, ImageDown } from 'lucide-react'
import { useReactFlow, getNodesBounds } from '@xyflow/react'
import { toPng } from 'html-to-image'
import { useStore } from '@/store/useStore'
import { toast } from '@/lib/toast'

function Btn({ icon, label, onClick, variant = 'default', disabled }: {
  icon: React.ReactNode; label: string; onClick: () => void; variant?: 'default' | 'danger' | 'active'; disabled?: boolean
}) {
  return (
    <button onClick={onClick} disabled={disabled} title={label}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '6px 10px', borderRadius: 5, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.35 : 1, transition: 'all 0.1s',
        border: `1px solid ${variant === 'danger' ? '#f85149' : variant === 'active' ? '#00e5ff' : '#30363d'}`,
        color: variant === 'danger' ? '#f85149' : variant === 'active' ? '#00e5ff' : '#8b949e',
        background: variant === 'active' ? '#00e5ff14' : 'transparent',
        fontFamily: '"JetBrains Mono", monospace', fontSize: 12,
      }}
    >{icon}</button>
  )
}

const Sep = () => <div style={{ width: 1, height: 22, background: '#21262d', margin: '0 4px', flexShrink: 0 }} />

export function Toolbar() {
  const fileInputRef   = useRef<HTMLInputElement>(null)
  const [nameEdit, setNameEdit] = useState(false)

  const projectName    = useStore((s) => s.projectName)
  const setProjectName = useStore((s) => s.setProjectName)
  const nodeCount      = useStore((s) => s.nodes.length)
  const edgeCount      = useStore((s) => s.edges.length)
  const snapToGrid     = useStore((s) => s.snapToGrid)
  const theme          = useStore((s) => s.theme)
  const past           = useStore((s) => s.past)
  const future         = useStore((s) => s.future)

  const saveDiagram    = useStore((s) => s.saveDiagram)
  const exportDiagram  = useStore((s) => s.exportDiagram)
  const importDiagram  = useStore((s) => s.importDiagram)
  const clearDiagram   = useStore((s) => s.clearDiagram)
  const undo           = useStore((s) => s.undo)
  const redo           = useStore((s) => s.redo)
  const toggleSnap     = useStore((s) => s.toggleSnapToGrid)
  const toggleTheme    = useStore((s) => s.toggleTheme)

  const rf = useReactFlow()

  const exportPng = useCallback(async () => {
    const nodes = useStore.getState().nodes
    const projectName = useStore.getState().projectName
    if (nodes.length === 0) { toast('Aucun nœud à exporter', 'warning'); return }

    const viewport = document.querySelector<HTMLElement>('.react-flow__viewport')
    if (!viewport) return

    const PADDING = 30
    const ZOOM = 1.5   // render at 1.5× for crispness, keeps size reasonable

    const bounds = getNodesBounds(nodes)

    // Image size = exact content size × zoom + padding on each side
    const W = Math.round(bounds.width  * ZOOM + PADDING * 2)
    const H = Math.round(bounds.height * ZOOM + PADDING * 2)

    // Translate so top-left of content lands at (PADDING, PADDING)
    const tx = -bounds.x * ZOOM + PADDING
    const ty = -bounds.y * ZOOM + PADDING

    try {
      // Hide handles during capture
      const style = document.createElement('style')
      style.id = 'hlab-export-hide'
      style.textContent = '.react-flow__handle { display: none !important; }'
      document.head.appendChild(style)

      const dataUrl = await toPng(viewport, {
        backgroundColor: '#0d1117',
        width: W,
        height: H,
        pixelRatio: 2,
        style: {
          width:           `${W}px`,
          height:          `${H}px`,
          transform:       `translate(${tx}px, ${ty}px) scale(${ZOOM})`,
          transformOrigin: 'top left',
        },
      })
      const a = document.createElement('a')
      const slug = projectName.replace(/\s+/g, '-').toLowerCase()
      a.href = dataUrl
      a.download = `${slug}.png`
      a.click()
      document.getElementById('hlab-export-hide')?.remove()
      toast(`Export PNG — ${projectName}`, 'success')
    } catch {
      document.getElementById('hlab-export-hide')?.remove()
      toast('Erreur export PNG', 'error')
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey
      if (meta && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
      if (meta && e.key === 'y') { e.preventDefault(); redo() }
      if (meta && e.key === 'z' && e.shiftKey) { e.preventDefault(); redo() }
      if (meta && e.key === 's') { e.preventDefault(); saveDiagram() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo, saveDiagram])

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => importDiagram(ev.target?.result as string)
    reader.readAsText(file); e.target.value = ''
  }

  return (
    <header className="flex items-center gap-2 px-4 shrink-0 border-b"
      style={{ background: '#0d1117', borderColor: '#21262d', height: 54, flexWrap: 'nowrap', overflow: 'hidden' }}
    >
      <div className="flex items-center gap-2 mr-1">
        <GitBranch size={14} style={{ color: '#00e5ff', flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: '#484f58', fontFamily: '"JetBrains Mono", monospace', whiteSpace: 'nowrap' }}>hlab</span>
      </div>
      <Sep />

      {nameEdit ? (
        <input autoFocus defaultValue={projectName}
          onBlur={(e) => { setProjectName(e.target.value || 'My HomeLab'); setNameEdit(false) }}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') e.currentTarget.blur() }}
          style={{ background: '#161b22', border: '1px solid #00e5ff', borderRadius: 5, color: '#e6edf3', fontSize: 13, padding: '3px 10px', outline: 'none', fontFamily: '"JetBrains Mono", monospace', width: 190 }}
        />
      ) : (
        <button onClick={() => setNameEdit(true)} title="Click to rename"
          style={{ background: 'none', border: 'none', cursor: 'text', padding: '3px 5px', fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: '#e6edf3', whiteSpace: 'nowrap' }}>
          {projectName}
        </button>
      )}
      <span style={{ fontSize: 11, color: '#484f58', fontFamily: '"JetBrains Mono", monospace', whiteSpace: 'nowrap', marginLeft: 5 }}>
        {nodeCount}n · {edgeCount}e
      </span>
      <Sep />

      <Btn icon={<Save size={15}/>}      label="Save (⌘S)"    onClick={saveDiagram} />
      <Btn icon={<Download size={15}/>}  label="Export JSON"  onClick={exportDiagram} disabled={nodeCount === 0} />
      <Btn icon={<ImageDown size={15}/>} label="Export PNG"   onClick={exportPng}    disabled={nodeCount === 0} />
      <Btn icon={<Upload size={15}/>}    label="Import JSON"  onClick={() => fileInputRef.current?.click()} />
      <Btn icon={<Trash2 size={15}/>}   label="Clear"        onClick={() => nodeCount > 0 && window.confirm(`Clear ${nodeCount} nodes?`) && clearDiagram()} variant="danger" disabled={nodeCount === 0} />
      <Sep />

      <Btn icon={<Undo2 size={15}/>} label="Undo (⌘Z)" onClick={undo} disabled={past.length === 0} />
      <Btn icon={<Redo2 size={15}/>} label="Redo (⌘Y)" onClick={redo} disabled={future.length === 0} />
      <Sep />

      <Btn icon={<ZoomIn  size={15}/>}   label="Zoom in"  onClick={() => rf.zoomIn()} />
      <Btn icon={<ZoomOut size={15}/>}   label="Zoom out" onClick={() => rf.zoomOut()} />
      <Btn icon={<Maximize2 size={15}/>} label="Fit view" onClick={() => rf.fitView({ padding: 0.2 })} />
      <Sep />

      <Btn icon={<Grid3X3 size={15}/>} label={snapToGrid ? 'Snap ON' : 'Snap OFF'} onClick={toggleSnap} variant={snapToGrid ? 'active' : 'default'} />
      <Btn icon={theme === 'dark' ? <Sun size={15}/> : <Moon size={15}/>} label="Toggle theme" onClick={toggleTheme} />

      <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
    </header>
  )
}
