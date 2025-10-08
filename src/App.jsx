import React, { useEffect, useMemo, useRef, useState } from 'react';
import './index.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import VisualizerCanvas from './components/VisualizerCanvas';
import ControlsPanel from './components/ControlsPanel';
import ExplanationPanel from './components/ExplanationPanel';
import { bubbleSortSteps } from './algorithms/bubbleSortSteps';
import { quickSortSteps } from './algorithms/quickSortSteps';
import { mergeSortSteps } from './algorithms/mergeSortSteps';
import { insertionSortSteps } from './algorithms/insertionSortSteps';
import { selectionSortSteps } from './algorithms/selectionSortSteps';
import { linearSearchSteps } from './algorithms/linearSearchSteps';
import { binarySearchSteps } from './algorithms/binarySearchSteps';

export default function App() {
  const [section, setSection] = useState('sorting');
  const [algorithm, setAlgorithm] = useState('bubbleSort');
  const [baseArray, setBaseArray] = useState(() =>
    Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1)
  );
  const [mode, setMode] = useState('array');
  const [searchTarget, setSearchTarget] = useState('');
  const [datasetInput, setDatasetInput] = useState('');
  const [datasetError, setDatasetError] = useState('');
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(300);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });

  // Compute algorithm steps
  const steps = useMemo(() => {
    switch (algorithm) {
      case 'quickSort':
        return quickSortSteps(baseArray);
      case 'mergeSort':
        return mergeSortSteps(baseArray);
      case 'insertionSort':
        return insertionSortSteps(baseArray);
      case 'selectionSort':
        return selectionSortSteps(baseArray);
      case 'linearSearch': {
        const t = Number(searchTarget);
        return Number.isFinite(t) ? linearSearchSteps(baseArray, t) : [];
      }
      case 'binarySearch': {
        const sorted = [...baseArray].sort((a, b) => a - b);
        const t = Number(searchTarget);
        return Number.isFinite(t) ? binarySearchSteps(sorted, t) : [];
      }
      case 'bubbleSort':
      default:
        return bubbleSortSteps(baseArray);
    }
  }, [baseArray, algorithm, searchTarget]);

  // Auto resize canvas based on parent container
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setCanvasSize({
          width: Math.max(300, clientWidth - 16), // padding buffer
          height: Math.max(200, clientHeight - 16),
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Play animation
  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;
    intervalRef.current && clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(intervalRef.current);
        setIsPlaying(false);
        return prev;
      });
    }, speedMs);
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [isPlaying, speedMs, steps.length]);

  useEffect(() => () => intervalRef.current && clearInterval(intervalRef.current), []);

  const onPlay = () => setIsPlaying(true);
  const onPause = () => setIsPlaying(false);
  const onReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
  };
  const onStep = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };
  const onShuffle = () => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
    const shuffled = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);
    setBaseArray(shuffled);
    setDatasetInput(shuffled.join(', '));
    setDatasetError('');
  };

  const onApplyDataset = (e) => {
    e?.preventDefault?.();
    setDatasetError('');
    const parts = datasetInput.split(',').map((s) => s.trim()).filter(Boolean);
    if (!parts.length) return setDatasetError('Enter at least one number.');
    const numbers = [];
    for (const p of parts) {
      const n = Number(p);
      if (!Number.isFinite(n)) return setDatasetError('All values must be numeric.');
      numbers.push(n);
    }
    setIsPlaying(false);
    setCurrentStepIndex(-1);
    setBaseArray(numbers);
    setDatasetInput(numbers.join(','));
  };

  const currentStep = steps[currentStepIndex] || null;
  const visualArray = currentStep ? currentStep.array : baseArray;
  const comparingIndices = currentStep?.comparing ?? [];
  const swappedIndices = currentStep?.swapped ? comparingIndices : [];
  const foundIndices = currentStep?.found ? comparingIndices : [];
  const sortedIndices = currentStep?.sortedIndices ?? (currentStepIndex >= steps.length - 1 ? visualArray.map((_, i) => i) : []);

  // Build frames for animation
  const visFrames = useMemo(() => {
    if (!steps || steps.length === 0) return [];
    if (mode === 'array') return buildArrayFrames(steps, canvasSize.width, canvasSize.height);
    // node mode removed
    if (mode === 'tree') return steps.map((s) => ({
      positions: null,
      comparing: s.comparing ?? [],
      swapped: !!s.swapped,
      found: !!s.found,
      sortedIndices: s.sortedIndices ?? [],
    }));
    return [];
  }, [steps, mode, canvasSize]);

  const frameIndexForRender = currentStepIndex >= 0 ? currentStepIndex : 0;

  // Array animation frames
  function buildArrayFrames(steps, width, height) {
    return steps.map((step) => {
      const n = step.array.length;
      const gap = 8;
      const padX = 24;
      const usableWidth = Math.max(1, width - padX * 2 - gap * (n - 1));
      const cellW = Math.max(28, Math.floor(usableWidth / n));
      const y = height / 2;
      const positions = step.array.map((_, idx) => ({
        index: idx,
        x: padX + idx * (cellW + gap) + cellW / 2,
        y,
        width: cellW,
      }));
      return { ...step, positions };
    });
  }

  // Node animation frames
  // node mode removed

  // Tree construction and layout
  function buildTree(arr, start = 0, end = arr.length) {
    if (start >= end) return null;
    const mid = Math.floor((start + end) / 2);
    const left = buildTree(arr, start, mid);
    const right = buildTree(arr, mid + 1, end);
    return { value: arr[mid], index: mid, left, right };
  }

  function layoutTree(root) {
    if (!root) return null;
    const levels = [];
    const traverse = (node, depth) => {
      if (!node) return;
      if (!levels[depth]) levels[depth] = [];
      levels[depth].push(node);
      traverse(node.left, depth + 1);
      traverse(node.right, depth + 1);
    };
    traverse(root, 0);
    const verticalSpacing = Math.max(60, canvasSize.height / 6);
    const horizontalSpacing = Math.max(100, canvasSize.width / 10);
    levels.forEach((nodesAtLevel, depth) => {
      const totalWidth = (nodesAtLevel.length - 1) * horizontalSpacing;
      nodesAtLevel.forEach((node, idx) => {
        node.x = canvasSize.width / 2 - totalWidth / 2 + idx * horizontalSpacing;
        node.y = 40 + depth * verticalSpacing;
      });
    });
    return root;
  }

  const treeRoot = layoutTree(buildTree(visualArray));

  return (
    <div className="w-screen h-screen flex flex-col bg-white">
      <Header
        algorithm={algorithm}
        onAlgorithmChange={setAlgorithm}
        mode={mode}
        onModeChange={setMode}
        isSearch={algorithm === 'linearSearch' || algorithm === 'binarySearch'}
        target={searchTarget}
        onTargetChange={setSearchTarget}
      />

      <div ref={containerRef} className="flex-1 flex flex-col min-h-0 px-4 sm:px-6 lg:px-12 py-4 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-[18rem_1fr] flex-1 min-h-0 gap-6">
          <Sidebar current={section} onSelect={setSection} algorithm={algorithm} onAlgorithmChange={setAlgorithm} />

          <div className="flex flex-col gap-4 h-full min-h-0">
            {/* Algorithm title & input */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{algorithm}</h2>
                <p className="text-sm text-gray-500">Enter numbers separated by commas to visualize.</p>
              </div>
              <form onSubmit={onApplyDataset} className="flex flex-wrap gap-3 items-center">
                <input
                  value={datasetInput}
                  onChange={(e) => setDatasetInput(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 w-40"
                  placeholder="e.g. 5,3,8,1"
                />
                <button className="px-3 py-1 bg-blue-600 text-white rounded" type="submit">
                  Apply
                </button>
                <button className="px-3 py-1 bg-gray-300 text-gray-900 rounded" type="button" onClick={onShuffle}>
                  Shuffle
                </button>
              </form>
              {datasetError && <p className="text-red-500 text-sm">{datasetError}</p>}
            </div>

            {/* Canvas */}
            <div className="flex-1 relative min-h-[300px]">
              <VisualizerCanvas
                mode={mode}
                array={visualArray}
                svgWidth={canvasSize.width}
                svgHeight={canvasSize.height}
                treeRoot={treeRoot}
                comparingIndices={comparingIndices}
                swappedIndices={swappedIndices}
                foundIndices={foundIndices}
                sortedIndices={sortedIndices}
                frames={visFrames}
                frameIndex={frameIndexForRender}
              />
            </div>

            {/* Controls */}
            <ControlsPanel
              canPlay={true}
              isPlaying={isPlaying}
              onPlay={onPlay}
              onPause={onPause}
              onStep={onStep}
              onReset={onReset}
              speedMs={speedMs}
              setSpeedMs={setSpeedMs}
            />

            {/* Explanation panel */}
            <ExplanationPanel currentStep={currentStep} />
          </div>
        </div>
      </div>
    </div>
  );
}
