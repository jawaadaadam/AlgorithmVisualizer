import React from 'react';
import TreeNode from './TreeNode';

export default function VisualizerCanvas({
  svgWidth,
  svgHeight,
  treeRoot,
  comparingIndices,
  swappedIndices,
}) {
  return (
    <div
      className="relative bg-white rounded-xl shadow border border-gray-200 w-full h-full flex items-center justify-center overflow-auto"
      style={{ minHeight: svgHeight }}
    >
      <svg
        className="block mx-auto"
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {treeRoot && (
          <TreeNode
            node={treeRoot}
            comparingIndices={comparingIndices}
            swappedIndices={swappedIndices}
            x={treeRoot.x ?? svgWidth / 2}
            y={treeRoot.y ?? 40}
          />
        )}
      </svg>
    </div>
  );
}
