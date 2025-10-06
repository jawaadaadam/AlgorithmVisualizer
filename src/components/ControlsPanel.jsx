import React from 'react';
import Controls from './Controls';

export default function ControlsPanel({
  canPlay,
  isPlaying,
  onPlay,
  onPause,
  onStep,
  onReset,
  speedMs,
  setSpeedMs,
}) {
  return (
    <div className="sticky bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-gray-200 shadow-inner">
      <div className="w-full px-4 sm:px-6 lg:px-12 py-3">
        <Controls
          canPlay={canPlay}
          isPlaying={isPlaying}
          onPlay={onPlay}
          onPause={onPause}
          onStep={onStep}
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
