import { useCallback } from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
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

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
    borderRadius: 6,
  })

  const handleClick = useCallback(() => setSelectedEdge(id), [id, setSelectedEdge])

  const strokeColor = isActive ? '#ffffff' : meta.color
  const label = data?.label || data?.bandwidth || ''

  return (
    <>
      {/* Wide transparent hit target */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={18}
        style={{ cursor: 'pointer' }}
        onClick={handleClick}
      />

      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth: isActive ? meta.strokeWidth + 0.5 : meta.strokeWidth,
          strokeDasharray: meta.strokeDasharray,
          filter: isActive ? `drop-shadow(0 0 4px ${meta.color}80)` : undefined,
          transition: 'stroke 0.15s, stroke-width 0.15s',
          cursor: 'pointer',
        }}
        markerEnd={data?.directed ? 'url(#hlab-arrow)' : undefined}
        onClick={handleClick}
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
          >
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 9,
              color: isActive ? '#ffffff' : meta.color,
              background: '#0d1117',
              border: `1px solid ${meta.color}40`,
              borderRadius: 3,
              padding: '1px 5px',
              lineHeight: 1.6,
              whiteSpace: 'nowrap',
              boxShadow: isActive ? `0 0 6px ${meta.color}50` : undefined,
            }}>
              {label}
            </span>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
