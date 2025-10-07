import React from 'react'

/**
 * Recursively render tree nodes and edges as SVG
 */
export default function TreeNode({
  node,
  comparingIndices = [],
  swappedIndices = [],
  sortedIndices = [],
  foundIndices = [],
  x = 0,
  y = 0,
}) {
  if (!node) return null

  const nodeRadius = 20
  const isComparing = node.index != null ? comparingIndices.includes(node.index) : (node.path ? comparingIndices.includes(node.path) : false)
  const isSwapped = node.index != null ? swappedIndices.includes(node.index) : (node.path ? swappedIndices.includes(node.path) : false)
  const isSorted = node.index != null ? sortedIndices.includes(node.index) : false
  const isFound = node.index != null ? foundIndices.includes(node.index) : false
  const fillColor = isFound ? '#ef4444' : isSorted ? '#22c55e' : isSwapped ? '#f59e0b' : isComparing ? '#fbbf24' : '#9ca3af'

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
      <circle cx={x} cy={y} r={nodeRadius} fill={fillColor} stroke="#333" strokeWidth={2} className="transition-colors duration-300" />
      <text x={x} y={y + 5} textAnchor="middle" fontSize={12} fill="#fff" fontWeight="bold">
        {node.value}
      </text>

      {/* Children */}
      {leftChild && (
        <TreeNode
          node={leftChild}
          comparingIndices={comparingIndices}
          swappedIndices={swappedIndices}
          sortedIndices={sortedIndices}
          foundIndices={foundIndices}
          x={leftChild.x}
          y={leftChild.y}
        />
      )}
      {rightChild && (
        <TreeNode
          node={rightChild}
          comparingIndices={comparingIndices}
          swappedIndices={swappedIndices}
          sortedIndices={sortedIndices}
          foundIndices={foundIndices}
          x={rightChild.x}
          y={rightChild.y}
        />
      )}
    </g>
  )
}
