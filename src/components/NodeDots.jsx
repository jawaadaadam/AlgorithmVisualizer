import React from 'react';

export default function NodeDots({
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

  // fallback pseudo-random positions if none provided
  const prand = (i, seed) => {
    const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };

  return (
    <div className="relative w-full h-full min-h-[240px] bg-white rounded-xl shadow border border-gray-200 p-6 overflow-hidden">
      {array.map((value, index) => {
        const highlightFound = isFound(index);
        const highlightSwap = isSwapped(index);
        const highlightCompare = isComparing(index);
        const isSorted = sortedIndices.includes(index);

        const bg =
          highlightFound
            ? 'bg-red-500'
            : isSorted
            ? 'bg-green-500'
            : highlightSwap
            ? 'bg-yellow-400'
            : highlightCompare
            ? 'bg-yellow-300'
            : 'bg-gray-300';

        const left = positions && positions[index] ? positions[index].xPct : 10 + (index * 10) % 80;
        const top = positions && positions[index] ? positions[index].yPct : 10 + (index * 15) % 80;
        const scale = highlightSwap || highlightCompare ? 1.15 : 1.0;

        return (
          <div
            key={index}
            className="absolute"
            style={{ left: `${left}%`, top: `${top}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div
              className={`w-7 h-7 md:w-9 md:h-9 rounded-full ${bg} transition-all duration-300 ease-in-out shadow-md flex items-center justify-center text-[10px] md:text-xs font-semibold text-white`}
              style={{ transform: `scale(${scale})` }}
              title={`index ${index}: ${value}`}
            >
              {value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
