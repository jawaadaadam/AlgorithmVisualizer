import React from 'react';

export default function ArrayBoxes({
  array,
  comparingIndices = [],
  swappedIndices = [],
  foundIndices = [],
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
          const bg = highlightFound
            ? 'bg-green-100 border-green-400 text-green-800'
            : highlightSwap
            ? 'bg-green-50 border-green-300 text-green-700'
            : highlightCompare
            ? 'bg-red-50 border-red-300 text-red-700'
            : 'bg-gray-50 border-gray-200 text-gray-800';
          return (
            <div
              key={index}
              className={`min-w-12 px-3 py-2 rounded-lg border text-sm font-medium text-center transition-colors duration-200 ${bg}`}
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
