import React from 'react';

export default function ArrayBoxes({
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
    <div className="w-full bg-white rounded-xl shadow border border-gray-200 p-4">
      <div className="flex items-stretch justify-center gap-2">
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
          return (
            <div
              key={index}
              className={`min-w-12 px-3 py-2 rounded-lg border text-sm font-medium text-center transition-all duration-300 ease-in-out ${bg}`}
              title={`index ${index}: ${value}`}
            >
              {value}
            </div>
          );
        })}
      </div>
    </div>
  );
}
