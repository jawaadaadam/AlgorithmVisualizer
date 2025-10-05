import React, { useEffect, useMemo, useState } from 'react';
import TreeNode from './TreeNode'; // We'll create a TreeNode component
import Controls from './Controls';
import ExplanationPanel from './ExplanationPanel';
import { bubbleSortSteps } from '../algorithms/bubbleSortSteps';

export default function TreeVisualizer({ initialArray = [5, 3, 8, 1, 2, 7] }) {
  const [baseArray] = useState(() => [...initialArray]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(300);

  const steps = useMemo(() => bubbleSortSteps(baseArray), [baseArray]);

  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;

    const intervalId = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
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
  const onPlay = () => canPlay && setIsPlaying(true);
  const onPause = () => setIsPlaying(false);
  const onReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
  };

  // Convert array to tree nodes
  const buildTree = (arr) => {
    if (!arr.length) return null;
    const mid = Math.floor(arr.length / 2);
    return {
      value: arr[mid],
      left: buildTree(arr.slice(0, mid)),
      right: buildTree(arr.slice(mid + 1)),
    };
  };

  const treeRoot = buildTree(visualArray);

  return (
    <div className="w-full max-w-3xl mx-auto bg-white p-4 rounded-lg shadow">
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

      <div className="mb-4">
        <label className="block text-sm text-gray-700 mb-1">Speed: {speedMs} ms</label>
        <input
          type="range"
          min={100}
          max={2000}
          step={50}
          value={speedMs}
          onChange={(e) => setSpeedMs(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="flex justify-center mt-4">
        {treeRoot && (
          <TreeNode
            node={treeRoot}
            comparingIndices={comparingIndices}
            swappedIndices={swappedIndices}
            path="" // Root path
          />
        )}
      </div>

      <div className="mt-3 text-sm text-gray-600">
        <span>Step: {Math.max(0, currentStepIndex + 1)} / {steps.length}</span>
        {isFinished && <span className="ml-2 text-green-600 font-medium">Sorted!</span>}
      </div>

      <ExplanationPanel step={currentStep} isFinished={isFinished} />
    </div>
  );
}
