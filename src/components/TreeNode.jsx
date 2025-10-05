import React from 'react'

/**
 * Recursively render tree nodes and edges as SVG
 */
export default function TreeNode({
  node,
  comparingIndices = [],
  swappedIndices = [],
  x = 0,
  y = 0,
}) {
  if (!node) return null

  const nodeRadius = 20
  const isComparing = node.path ? comparingIndices.includes(node.path) : false
  const isSwapped = node.path ? swappedIndices.includes(node.path) : false
  const fillColor = isSwapped ? '#22c55e' : isComparing ? '#f59e0b' : '#3b82f6'

  const leftChild = node.left
  const rightChild = node.right

  return (
    <g>
      {/* Edges */}
      {leftChild && (
        <line x1={x} y1={y} x2={leftChild.x} y2={leftChild.y} stroke="#888" strokeWidth={2} />
      )}
      {rightChild && (
        <line x1={x} y1={y} x2={rightChild.x} y2={rightChild.y} stroke="#888" strokeWidth={2} />
      )}

      {/* Node */}
      <circle cx={x} cy={y} r={nodeRadius} fill={fillColor} stroke="#333" strokeWidth={2} />
      <text x={x} y={y + 5} textAnchor="middle" fontSize={12} fill="#fff" fontWeight="bold">
        {node.value}
      </text>

      {/* Children */}
      {leftChild && (
        <TreeNode
          node={leftChild}
          comparingIndices={comparingIndices}
          swappedIndices={swappedIndices}
          x={leftChild.x}
          y={leftChild.y}
        />
      )}
      {rightChild && (
        <TreeNode
          node={rightChild}
          comparingIndices={comparingIndices}
          swappedIndices={swappedIndices}
          x={rightChild.x}
          y={rightChild.y}
        />
      )}
    </g>
  )
}
