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

  return (
    <div className="w-full bg-white rounded-xl shadow border border-gray-200 p-6 overflow-auto">
      <div className="flex items-end justify-center gap-4">
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
          return (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-6 h-6 md:w-8 md:h-8 rounded-full ${bg} transition-all duration-300 ease-in-out shadow transform`}
                title={`index ${index}: ${value}`}
                style={{ transform: `translateX(0)` }}
              />
              <div className="text-xs text-gray-600 mt-2">{value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
