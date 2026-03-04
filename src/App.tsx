import { useEffect } from 'react'
import { Toolbar } from '@/components/toolbar/Toolbar'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { Canvas } from '@/components/canvas/Canvas'
import { PropertiesPanel } from '@/components/properties/PropertiesPanel'
import { EdgePropertiesPanel } from '@/components/properties/EdgePropertiesPanel'
import { ToastContainer } from '@/components/ui/ToastContainer'
import { useStore } from '@/store/useStore'
import { ReactFlowProvider } from '@xyflow/react'

export default function App() {
  const loadFromStorage = useStore((s) => s.loadFromStorage)
  const saveDiagram     = useStore((s) => s.saveDiagram)
  const selectedNodeId  = useStore((s) => s.selectedNodeId)
  const selectedEdgeId  = useStore((s) => s.selectedEdgeId)
  const theme           = useStore((s) => s.theme)

  useEffect(() => {
    loadFromStorage()
    const interval = setInterval(saveDiagram, 30_000)
    const onUnload = () => saveDiagram()
    window.addEventListener('beforeunload', onUnload)
    return () => { clearInterval(interval); window.removeEventListener('beforeunload', onUnload) }
  }, [loadFromStorage, saveDiagram])

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-full w-full overflow-hidden" style={{ background: theme === 'dark' ? '#0d1117' : '#f0f4f8' }}>
        <Toolbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <Canvas />
          {selectedNodeId && <PropertiesPanel />}
          {selectedEdgeId && !selectedNodeId && <EdgePropertiesPanel />}
        </div>
      </div>
      <ToastContainer />
    </ReactFlowProvider>
  )
}
