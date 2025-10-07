import React, { useEffect, useMemo, useState } from 'react';
import Controls from './Controls';
import ExplanationPanel from './ExplanationPanel';
import VisualizerCanvas from './VisualizerCanvas';
import { bubbleSortSteps } from '../algorithms/bubbleSortSteps';

// ArrayVisualizer wrapper that delegates rendering to VisualizerCanvas
// It will use ArrayBoxes or NodeDots (or Tree) based on the `mode` prop
export default function ArrayVisualizer({ initialArray = [5, 3, 8, 1, 2, 7], mode = 'array' }) {
  const [baseArray] = useState(() => [...initialArray]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(300);

  const steps = useMemo(() => bubbleSortSteps(baseArray), [baseArray]);

  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;
    const id = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, Math.max(50, speedMs));
    return () => clearInterval(id);
  }, [isPlaying, speedMs, steps.length]);

  const isFinished = steps.length > 0 && currentStepIndex >= steps.length - 1;
  const currentStep = currentStepIndex >= 0 && currentStepIndex < steps.length ? steps[currentStepIndex] : null;
  const visualArray = currentStep ? currentStep.array : baseArray;
  const comparingIndices = currentStep ? currentStep.comparing ?? [] : [];
  const swappedIndices = currentStep && currentStep.swapped ? (currentStep.comparing ?? []) : [];
  const foundIndices = currentStep && currentStep.found ? (currentStep.comparing ?? []) : [];
  const sortedIndices = currentStep && currentStep.sortedIndices ? currentStep.sortedIndices : (isFinished ? visualArray.map((_, i) => i) : []);

  const canPlay = !isFinished;
  const onPlay = () => canPlay && setIsPlaying(true);
  const onPause = () => setIsPlaying(false);
  const onReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
  };

  return (
    <div className="w-full mx-auto bg-white p-4 rounded-lg shadow">
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

      <VisualizerCanvas
        mode={mode}
        array={visualArray}
        comparingIndices={comparingIndices}
        swappedIndices={swappedIndices}
        foundIndices={foundIndices}
        sortedIndices={sortedIndices}
      />

      <div className="mt-3 text-sm text-gray-600 text-center">
        <span>Step: {Math.max(0, currentStepIndex + 1)} / {steps.length}</span>
        {isFinished && <span className="ml-2 text-green-600 font-medium">Sorted!</span>}
      </div>

      <ExplanationPanel step={currentStep} isFinished={isFinished} />
    </div>
  );
}
