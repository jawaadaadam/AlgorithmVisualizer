import React from 'react';

export default function Header({ algorithm, onAlgorithmChange, mode, onModeChange, target, onTargetChange, isSearch }) {
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Algorithm Visualizer</h1>
          <nav className="hidden md:flex items-center gap-5 text-sm">
            <a className="text-gray-600 hover:text-teal-600 transition-colors" href="#">Home</a>
            <a className="text-gray-600 hover:text-teal-600 transition-colors" href="#algorithms">Algorithms</a>
            <a className="text-gray-600 hover:text-teal-600 transition-colors" href="#about">About</a>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={algorithm}
            onChange={(e) => onAlgorithmChange?.(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white text-gray-800 shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="bubbleSort">Bubble Sort</option>
            <option value="linearSearch">Linear Search</option>
            <option value="quickSort">Quick Sort</option>
            <option value="mergeSort">Merge Sort</option>
            <option value="insertionSort">Insertion Sort</option>
            <option value="selectionSort">Selection Sort</option>
            <option value="binarySearch">Binary Search</option>
          </select>
          <select
            value={mode}
            onChange={(e) => onModeChange?.(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white text-gray-800 shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="array">Array</option>
            <option value="nodes">Node</option>
            <option value="tree">Tree</option>
          </select>
          {isSearch && (
            <input
              value={target}
              onChange={(e) => onTargetChange?.(e.target.value)}
              placeholder="Target"
              className="px-3 py-2 rounded-xl bg-white text-gray-800 shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 w-28"
            />
          )}
        </div>
      </div>
    </header>
  );
}
