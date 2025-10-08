import React from 'react';
import TreeNode from './TreeNode';
import ArrayBoxes from './ArrayBoxes';
// NodeDots removed; node mode no longer supported

export default function VisualizerCanvas({
  mode = 'array',
  array = [],
  svgWidth = 600,
  svgHeight = 400,
  treeRoot,
  comparingIndices = [],
  swappedIndices = [],
  foundIndices = [],
  sortedIndices = [],
  frames = [],
  frameIndex = 0,
}) {
  // Safe frame positions
  const positions =
    Array.isArray(frames) && frames[frameIndex] && frames[frameIndex].positions
      ? frames[frameIndex].positions
      : null;

  return (
    <div className="flex-1 relative w-full min-h-[300px] bg-white rounded-xl shadow border border-gray-200 p-4 overflow-hidden">
      {mode === 'array' && (
        <ArrayBoxes
          array={array}
          comparingIndices={comparingIndices}
          swappedIndices={swappedIndices}
          foundIndices={foundIndices}
          sortedIndices={sortedIndices}
          positions={positions}
        />
      )}
      {/* node mode removed */}
      {mode === 'tree' && treeRoot && (
        <div className="w-full h-full overflow-auto flex justify-center items-start">
          <svg
            width={svgWidth}
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <TreeNode
              node={treeRoot}
              comparingIndices={comparingIndices}
              swappedIndices={swappedIndices}
              foundIndices={foundIndices}
              sortedIndices={sortedIndices}
              x={treeRoot.x ?? svgWidth / 2}
              y={treeRoot.y ?? 40}
            />
          </svg>
        </div>
      )}
    </div>
  );
}
