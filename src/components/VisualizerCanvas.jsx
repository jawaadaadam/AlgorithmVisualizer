import React from 'react';
import TreeNode from './TreeNode';
import ArrayBoxes from './ArrayBoxes';
import NodeDots from './NodeDots';

export default function VisualizerCanvas({
  mode = 'tree',
  array = [],
  svgWidth,
  svgHeight,
  treeRoot,
  comparingIndices,
  swappedIndices,
  foundIndices = [],
}) {
  return (
    <div className="relative w-full h-full">
      {mode === 'array' && (
        <ArrayBoxes
          array={array}
          comparingIndices={comparingIndices}
          swappedIndices={swappedIndices}
          foundIndices={foundIndices}
        />
      )}
      {mode === 'nodes' && (
        <NodeDots
          array={array}
          comparingIndices={comparingIndices}
          swappedIndices={swappedIndices}
          foundIndices={foundIndices}
        />
      )}
      {mode === 'tree' && (
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
      )}
    </div>
  );
}
