import { useStore } from '@/store/useStore'

/** Returns a Set of handle ids that have at least one edge connected on the given node. */
export function useConnectedHandles(nodeId: string): Set<string> {
  const edges = useStore((s) => s.edges)
  const connected = new Set<string>()
  for (const e of edges) {
    if (e.source === nodeId && e.sourceHandle) connected.add(e.sourceHandle)
    if (e.target === nodeId && e.targetHandle) connected.add(e.targetHandle)
  }
  return connected
}
