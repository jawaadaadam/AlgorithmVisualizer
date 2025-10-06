import React from 'react';

export default function Sidebar({ current, onSelect, algorithm, onAlgorithmChange }) {
  const items = [
    { key: 'sorting', label: 'Sorting' },
    { key: 'searching', label: 'Searching' },
  ];
  return (
    <aside className="h-full w-full md:w-64 bg-white/70 backdrop-blur border-r border-gray-200 p-4">
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 mb-1">Algorithm</label>
        <select
          value={algorithm}
          onChange={(e) => onAlgorithmChange?.(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="bubbleSort">Bubble Sort</option>
          <option value="linearSearch">Linear Search</option>
          <option value="quickSort">Quick Sort</option>
          <option value="mergeSort">Merge Sort</option>
          <option value="insertionSort">Insertion Sort</option>
          <option value="selectionSort">Selection Sort</option>
        </select>
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const active = current === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelect?.(item.key)}
              className={
                `w-full text-left px-3 py-2 rounded-lg transition ` +
                (active
                  ? 'bg-indigo-600 text-white shadow'
                  : 'hover:bg-gray-100 text-gray-700')
              }
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
