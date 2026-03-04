import { useCallback } from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
  type Edge,
} from '@xyflow/react'
import type { HLabEdgeData } from '@/types'
import { EDGE_META } from '@/types'
import { useStore } from '@/store/useStore'

export type HLabEdgeType = Edge<HLabEdgeData>

export function HLabEdgeComponent({
  id,
  sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  data,
  selected,
}: EdgeProps<HLabEdgeType>) {
  const setSelectedEdge = useStore((s) => s.setSelectedEdge)
  const selectedEdgeId  = useStore((s) => s.selectedEdgeId)

  const edgeType = data?.edgeType ?? 'ethernet'
  const meta     = EDGE_META[edgeType]
  const isActive = selected || selectedEdgeId === id

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  })

  const handleClick = useCallback(() => setSelectedEdge(id), [id, setSelectedEdge])

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedEdge(id)
    window.dispatchEvent(new CustomEvent('hlab:edit-edge', { detail: { id } }))
  }, [id, setSelectedEdge])

  const strokeColor = isActive ? '#ffffff' : meta.color
  const label = data?.label || data?.bandwidth || ''

  return (
    <>
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={16}
        style={{ cursor: 'pointer' }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      />
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth: meta.strokeWidth,
          strokeDasharray: meta.strokeDasharray,
          transition: 'stroke 0.15s',
        }}
        markerEnd={data?.directed ? 'url(#hlab-arrow)' : undefined}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
              cursor: 'pointer',
            }}
            className="nopan"
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
          >
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 9,
              color: meta.color,
              background: '#0d1117',
              border: `1px solid ${meta.color}30`,
              borderRadius: 3,
              padding: '1px 5px',
              lineHeight: 1.6,
              whiteSpace: 'nowrap',
            }}>
              {label}
            </span>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
