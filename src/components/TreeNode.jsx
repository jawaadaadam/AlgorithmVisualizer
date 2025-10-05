import React from 'react'

/**
 * Recursively render tree nodes and edges as SVG
 */
export default function TreeNode({
  node,
  comparingIndices = [],
  swappedIndices = [],
  path = '',
  x = 0,
  y = 0,
  level = 0,
  horizontalSpacing = 200,
  verticalSpacing = 80,
}) {
  if (!node) return null

  const nodeRadius = 20
  const isComparing = comparingIndices.includes(node.path)
  const isSwapped = swappedIndices.includes(node.path)
  const fillColor = isSwapped ? '#22c55e' : isComparing ? '#f59e0b' : '#3b82f6'

  const leftX = x - horizontalSpacing / (level + 1)
  const rightX = x + horizontalSpacing / (level + 1)
  const childY = y + verticalSpacing

  return (
    <g>
      {/* Edges */}
      {node.left && <line x1={x} y1={y} x2={leftX} y2={childY} stroke="#888" strokeWidth={2} />}
      {node.right && <line x1={x} y1={y} x2={rightX} y2={childY} stroke="#888" strokeWidth={2} />}

      {/* Node */}
      <circle cx={x} cy={y} r={nodeRadius} fill={fillColor} stroke="#333" strokeWidth={2} />
      <text x={x} y={y + 5} textAnchor="middle" fontSize={12} fill="#fff" fontWeight="bold">
        {node.value}
      </text>

      {/* Children */}
      {node.left && (
        <TreeNode
          node={node.left}
          comparingIndices={comparingIndices}
          swappedIndices={swappedIndices}
          path={node.left.path}
          x={leftX}
          y={childY}
          level={level + 1}
          horizontalSpacing={horizontalSpacing}
          verticalSpacing={verticalSpacing}
        />
      )}
      {node.right && (
        <TreeNode
          node={node.right}
          comparingIndices={comparingIndices}
          swappedIndices={swappedIndices}
          path={node.right.path}
          x={rightX}
          y={childY}
          level={level + 1}
          horizontalSpacing={horizontalSpacing}
          verticalSpacing={verticalSpacing}
        />
      )}
    </g>
  )
}
