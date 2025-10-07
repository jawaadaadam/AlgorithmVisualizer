import React from 'react';

export default function Controls({
  canPlay,
  isPlaying,
  onPlay,
  onPause,
  onStep,
  onReset,
  speedMs,
  setSpeedMs,
  min = 100,
  max = 2000,
}) {
  return (
    <div className="flex flex-wrap items-center justify-center md:justify-between gap-3 mb-4">
      <h2 className="text-xl font-semibold">Player</h2>
      <div className="flex flex-wrap items-center gap-3 justify-center">
        <button
          className={`px-4 py-2 rounded-lg shadow-sm font-semibold text-white transition-colors duration-200 flex items-center gap-2 ${canPlay ? 'bg-gradient-to-r from-sky-400 to-teal-400 hover:from-sky-500 hover:to-teal-500' : 'bg-gray-400 cursor-not-allowed'}`}
          onClick={onPlay}
          disabled={!canPlay}
        >
          {isPlaying ? 'Resume' : 'Play'}
        </button>
        <button
          className="px-4 py-2 rounded-lg shadow-sm font-semibold text-white transition-colors duration-200 flex items-center gap-2 bg-rose-500 hover:bg-rose-600"
          onClick={onPause}
        >
          Pause
        </button>
        <button
          className="px-4 py-2 rounded-lg shadow-sm font-semibold text-white transition-colors duration-200 flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
          onClick={onStep}
        >
          Step
        </button>
        <button
          className="px-4 py-2 rounded-lg shadow-sm font-semibold text-white transition-colors duration-200 flex items-center gap-2 bg-rose-500 hover:bg-rose-600"
          onClick={onReset}
        >
          Reset
        </button>
      </div>
      <div className="ml-0 md:ml-4 w-full sm:w-64">
        <label className="block text-sm text-gray-700 mb-1">Speed: {speedMs} ms</label>
        <input
          type="range"
          min={min}
          max={max}
          step={50}
          value={speedMs}
          onChange={(e) => setSpeedMs(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}
