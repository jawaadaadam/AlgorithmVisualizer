import React from 'react';

export default function Controls({
  canPlay,
  isPlaying,
  onPlay,
  onPause,
  onReset,
  speedMs,
  setSpeedMs,
  min = 100,
  max = 2000,
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">Bubble Sort Player</h2>
      <div className="flex items-center gap-2">
        <button
          className={`px-3 py-1 rounded text-white ${canPlay ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
          onClick={onPlay}
          disabled={!canPlay}
        >
          {isPlaying ? 'Resume' : 'Play'}
        </button>
        <button
          className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white"
          onClick={onPause}
        >
          Pause
        </button>
        <button
          className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-800 text-white"
          onClick={onReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
