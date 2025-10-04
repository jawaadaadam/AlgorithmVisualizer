import React, { useEffect, useMemo, useState } from 'react';
import Bars from './Bars';
import { bubbleSortSteps } from '../algorithms/bubbleSortSteps';

export default function ArrayVisualizer({ initialArray = [5, 3, 8, 1, 2, 7] }) {
  const [baseArray] = useState(() => [...initialArray]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(300);

  const steps = useMemo(() => bubbleSortSteps(baseArray), [baseArray]);

  useEffect(() => {
    if (!isPlaying) return undefined;
    if (steps.length === 0) return undefined;

    const intervalId = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        // Stop when finished
        clearInterval(intervalId);
        setIsPlaying(false);
        return prev;
      });
    }, Math.max(20, speedMs));

    return () => clearInterval(intervalId);
  }, [isPlaying, speedMs, steps.length]);

  const isFinished = steps.length > 0 && currentStepIndex >= steps.length - 1;
  const currentStep = currentStepIndex >= 0 && currentStepIndex < steps.length ? steps[currentStepIndex] : null;

  const visualArray = currentStep ? currentStep.array : baseArray;
  const comparingIndices = currentStep ? currentStep.comparing : [];
  const swappedIndices = isFinished
    ? visualArray.map((_, idx) => idx)
    : currentStep && currentStep.swapped
    ? currentStep.comparing
    : [];

  const canPlay = !isFinished;
  const onPlay = () => {
    if (canPlay) setIsPlaying(true);
  };
  const onPause = () => setIsPlaying(false);
  const onReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Bubble Sort Player</h2>
        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-1 rounded text-white ${canPlay ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
            onClick={onPlay}
            disabled={!canPlay}
          >
            Play
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

      <div className="mb-4">
        <label className="block text-sm text-gray-700 mb-1">Speed: {speedMs} ms</label>
        <input
          type="range"
          min={50}
          max={1000}
          step={10}
          value={speedMs}
          onChange={(e) => setSpeedMs(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <Bars
        array={visualArray}
        comparingIndices={comparingIndices}
        swappedIndices={swappedIndices}
        height={240}
        gap={6}
        padding={12}
      />

      <div className="mt-3 text-sm text-gray-600">
        <span>Step: {Math.max(0, currentStepIndex + 1)} / {steps.length}</span>
        {isFinished && <span className="ml-2 text-green-600 font-medium">Sorted!</span>}
      </div>
    </div>
  );
}
