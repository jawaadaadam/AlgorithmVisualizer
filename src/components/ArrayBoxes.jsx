import React from 'react';

export default function ArrayBoxes({
  array,
  comparingIndices = [],
  swappedIndices = [],
  foundIndices = [],
  sortedIndices = [],
  positions = null,
}) {
  const isComparing = (i) => comparingIndices.includes(i);
  const isSwapped = (i) => swappedIndices.includes(i);
  const isFound = (i) => foundIndices.includes(i);

  return (
    <div className="w-full h-full bg-white rounded-xl shadow border border-gray-200 p-4">
      {/* top rail to emphasize array layout */}
      <div className="w-full h-0.5 bg-gray-300 mb-3" />
      <div className="flex flex-wrap items-center justify-center w-full gap-2 relative">
        {array.map((value, index) => {
          const highlightFound = isFound(index);
          const highlightSwap = isSwapped(index);
          const highlightCompare = isComparing(index);
          const isSorted = sortedIndices.includes(index);

          const bg =
            highlightFound
              ? 'bg-red-500 border-red-600 text-white'
              : isSorted
              ? 'bg-green-500 border-green-600 text-white'
              : highlightSwap
              ? 'bg-yellow-400 border-yellow-500 text-gray-900'
              : highlightCompare
              ? 'bg-yellow-300 border-yellow-400 text-gray-900'
              : 'bg-gray-300 border-gray-400 text-gray-800';

          // Use absolute positions if provided by frames, otherwise default flex layout
          const stylePos = positions && positions[index]
            ? {
                position: 'absolute',
                left: positions[index].x,
                top: positions[index].y,
                transform: 'translate(-50%, -50%)',
              }
            : { display: 'inline-block', margin: '2px' };

          return (
            <div
              key={index}
              className={`min-w-12 px-4 py-3 rounded-lg border text-sm font-semibold text-center transition-all duration-300 ease-in-out transform ${bg}`}
              style={stylePos}
              title={`index ${index}: ${value}`}
            >
              {value}
            </div>
          );
        })}
      </div>
      {/* bottom rail */}
      <div className="w-full h-0.5 bg-gray-300 mt-3" />
    </div>
  );
}
