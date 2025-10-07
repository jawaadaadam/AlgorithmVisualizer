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
      {/* array rail */}
      <div className="w-full h-0.5 bg-gray-200 mb-4" />
      <div className="flex items-stretch justify-center gap-2 relative">
        {array.map((value, index) => {
          const highlightFound = isFound(index);
          const highlightSwap = isSwapped(index);
          const highlightCompare = isComparing(index);
          const isSorted = sortedIndices.includes(index);
          const bg = highlightFound
            ? 'bg-red-500 border-red-600 text-white'
            : isSorted
            ? 'bg-green-500 border-green-600 text-white'
            : highlightSwap
            ? 'bg-yellow-400 border-yellow-500 text-gray-900'
            : highlightCompare
            ? 'bg-yellow-300 border-yellow-400 text-gray-900'
            : 'bg-gray-300 border-gray-400 text-gray-800';
          let translateX = 0;
          if (highlightSwap && Array.isArray(comparingIndices) && comparingIndices.length === 2) {
            const [a, b] = comparingIndices;
            if (index === a) translateX = -8;
            if (index === b) translateX = 8;
          }
          const stylePos = positions && positions[index]
            ? { position: 'absolute', left: positions[index].x, top: positions[index].y, transform: `translate(-50%, -50%) translateX(${translateX}px)` }
            : undefined
          return (
            <div className="flex flex-col items-center" style={stylePos}>
              <div className="w-0.5 h-4 bg-gray-300" />
              <div
                key={index}
                className={`min-w-12 px-4 py-3 rounded-lg border text-sm font-semibold text-center transition-all duration-300 ease-in-out transform ${bg}`}
                title={`index ${index}: ${value}`}
                style={!stylePos ? { transform: `translateX(${translateX}px)` } : undefined}
              >
                {value}
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-full h-0.5 bg-gray-200 mt-4" />
    </div>
  );
}
