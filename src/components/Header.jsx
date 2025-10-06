import React from 'react';

export default function Header({ algorithm, onAlgorithmChange }) {
  return (
    <header className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-lg md:text-2xl font-semibold tracking-tight">AlgorithmVisualizer</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm md:text-base opacity-90 hidden sm:inline">Interactive algorithm animations</span>
          <select
            value={algorithm}
            onChange={(e) => onAlgorithmChange?.(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/90 text-gray-800 shadow border border-white/30 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <option value="bubbleSort">Bubble Sort</option>
            <option value="linearSearch">Linear Search</option>
            <option value="quickSort">Quick Sort</option>
            <option value="mergeSort">Merge Sort</option>
            <option value="insertionSort">Insertion Sort</option>
            <option value="selectionSort">Selection Sort</option>
          </select>
        </div>
      </div>
    </header>
  );
}
