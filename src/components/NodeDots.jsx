import React from 'react';

export default function NodeDots({
  array,
  comparingIndices = [],
  swappedIndices = [],
  foundIndices = [],
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
          const bg = highlightFound
            ? 'bg-green-500'
            : highlightSwap
            ? 'bg-green-400'
            : highlightCompare
            ? 'bg-red-400'
            : 'bg-indigo-500';
          return (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${bg} transition-all duration-200 shadow`}
                title={`index ${index}: ${value}`}
              />
              <div className="text-xs text-gray-600 mt-2">{value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
