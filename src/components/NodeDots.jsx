import React from 'react';

export default function NodeDots({
  array,
  comparingIndices = [],
  swappedIndices = [],
  foundIndices = [],
  sortedIndices = [],
}) {
  const isComparing = (i) => comparingIndices.includes(i);
  const isSwapped = (i) => swappedIndices.includes(i);
  const isFound = (i) => foundIndices.includes(i);

  // Deterministic pseudo-random generator for stable positions per index
  const prand = (i, seed) => {
    const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };

  return (
    <div className="w-full h-full bg-white rounded-xl shadow border border-gray-200 p-6 overflow-hidden">
      <div className="relative w-full h-full min-h-[240px]">
        {array.map((value, index) => {
          const highlightFound = isFound(index);
          const highlightSwap = isSwapped(index);
          const highlightCompare = isComparing(index);
          const isSorted = sortedIndices.includes(index);
          const bg = highlightFound
            ? 'bg-red-500'
            : isSorted
            ? 'bg-green-500'
            : highlightSwap
            ? 'bg-yellow-400'
            : highlightCompare
            ? 'bg-yellow-300'
            : 'bg-gray-300';
          const left = 10 + prand(index, 1) * 80; // 10% .. 90%
          const top = 10 + prand(index, 2) * 80;  // 10% .. 90%
          const scale = highlightSwap || highlightCompare ? 1.15 : 1.0;
          return (
            <div key={index} className="absolute" style={{ left: `${left}%`, top: `${top}%`, transform: 'translate(-50%, -50%)' }}>
              <div
                className={`w-7 h-7 md:w-9 md:h-9 rounded-xl ${bg} transition-all duration-300 ease-in-out shadow-md flex items-center justify-center text-[10px] md:text-xs font-semibold text-white`}
                title={`index ${index}: ${value}`}
                style={{ transform: `scale(${scale})` }}
              >
                {value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
