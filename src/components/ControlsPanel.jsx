import React from 'react';
import Controls from './Controls';

export default function ControlsPanel({
  canPlay,
  isPlaying,
  onPlay,
  onPause,
  onReset,
  speedMs,
  setSpeedMs,
}) {
  return (
    <div className="sticky bottom-0 inset-x-0 bg-white/90 backdrop-blur border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <Controls
          canPlay={canPlay}
          isPlaying={isPlaying}
          onPlay={onPlay}
          onPause={onPause}
          onReset={onReset}
          speedMs={speedMs}
          setSpeedMs={setSpeedMs}
          min={100}
          max={2000}
        />
      </div>
    </div>
  );
}
