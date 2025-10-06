import React from 'react';

export default function Header() {
  return (
    <header className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-lg md:text-2xl font-semibold tracking-tight">AlgorithmVisualizer</h1>
        <span className="text-sm md:text-base opacity-90">Interactive algorithm animations</span>
      </div>
    </header>
  );
}
