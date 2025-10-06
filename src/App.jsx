import React, { useEffect, useMemo, useRef, useState } from 'react'
import './index.css'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import VisualizerCanvas from './components/VisualizerCanvas'
import ControlsPanel from './components/ControlsPanel'
import ExplanationPanel from './components/ExplanationPanel'
import { bubbleSortSteps } from './algorithms/bubbleSortSteps'
import { quickSortSteps } from './algorithms/quickSortSteps'
import { mergeSortSteps } from './algorithms/mergeSortSteps'
import { insertionSortSteps } from './algorithms/insertionSortSteps'
import { selectionSortSteps } from './algorithms/selectionSortSteps'
import { linearSearchSteps } from './algorithms/linearSearchSteps'
import { binarySearchSteps } from './algorithms/binarySearchSteps'

export default function App() {
  const [section, setSection] = useState('sorting')
  const [algorithm, setAlgorithm] = useState('bubbleSort')
  const [baseArray, setBaseArray] = useState(() =>
    Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1)
  )
  const [mode, setMode] = useState('array')
  const [searchTarget, setSearchTarget] = useState('')
  const [datasetInput, setDatasetInput] = useState('')
  const [datasetError, setDatasetError] = useState('')
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speedMs, setSpeedMs] = useState(300)
  const intervalRef = useRef(null)

  const steps = useMemo(() => {
    // Shared step interface: { array, comparing: [i,j?], swapped?: boolean, found?: boolean }
    switch (algorithm) {
      case 'quickSort':
        return quickSortSteps(baseArray)
      case 'mergeSort':
        return mergeSortSteps(baseArray)
      case 'insertionSort':
        return insertionSortSteps(baseArray)
      case 'selectionSort':
        return selectionSortSteps(baseArray)
      case 'linearSearch': {
        const t = Number(searchTarget)
        return Number.isFinite(t) ? linearSearchSteps(baseArray, t) : []
      }
      case 'binarySearch': {
        const sorted = [...baseArray].sort((a,b) => a - b)
        const t = Number(searchTarget)
        return Number.isFinite(t) ? binarySearchSteps(sorted, t) : []
      }
      case 'bubbleSort':
      default:
        return bubbleSortSteps(baseArray)
    }
  }, [baseArray, algorithm, searchTarget])
  const currentStep =
    currentStepIndex >= 0 && currentStepIndex < steps.length
      ? steps[currentStepIndex]
      : null
  const isFinished = steps.length > 0 && currentStepIndex >= steps.length - 1

  useEffect(() => {
    if (!isPlaying || steps.length === 0) return
    intervalRef.current && clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < steps.length - 1) return prev + 1
        clearInterval(intervalRef.current)
        setIsPlaying(false)
        return prev
      })
    }, speedMs)
    return () => intervalRef.current && clearInterval(intervalRef.current)
  }, [isPlaying, speedMs, steps.length])

  useEffect(() => () => intervalRef.current && clearInterval(intervalRef.current), [])

  const canPlay = !isFinished
  const onPlay = () => canPlay && setIsPlaying(true)
  const onPause = () => setIsPlaying(false)
  const onReset = () => {
    setIsPlaying(false)
    setCurrentStepIndex(-1)
  }
  const onStep = () => {
    setIsPlaying(false)
    setCurrentStepIndex(prev => Math.min(prev + 1, Math.max(steps.length - 1, 0)))
  }
  const onShuffle = () => {
    setIsPlaying(false)
    setCurrentStepIndex(-1)
    const shuffled = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1)
    setBaseArray(shuffled)
    setDatasetInput(shuffled.join(', '))
    setDatasetError('')
  }

  const visualArray = currentStep ? currentStep.array : baseArray
  const comparingIndices = currentStep ? currentStep.comparing ?? [] : []
  const swappedIndices = currentStep && currentStep.swapped ? (currentStep.comparing ?? []) : []
  const foundIndices = currentStep && currentStep.found
    ? (currentStep.comparing ?? [])
    : []

  // 🌳 Responsive spacing and sizes
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getSvgDimensions = () => {
    if (windowWidth < 500) return { width: 360, height: 300 }
    if (windowWidth < 800) return { width: 700, height: 350 }
    return { width: 1000, height: 400 }
  }

  const { width: svgWidth, height: svgHeight } = getSvgDimensions()

  // Convert array to a balanced binary tree of defined values only
  const buildTree = (arr, start = 0, end = arr.length) => {
    if (start >= end) return null
    const mid = Math.floor((start + end) / 2)
    const midValue = arr[mid]

    // If the midpoint value is not a valid number, try building children only.
    if (midValue === null || midValue === undefined || Number.isNaN(midValue)) {
      // Attempt to build subtrees; if both are null, return null to avoid dangling lines
      const leftOnly = buildTree(arr, start, mid)
      const rightOnly = buildTree(arr, mid + 1, end)
      // Prefer a non-null subtree if one exists
      if (leftOnly && !rightOnly) return leftOnly
      if (!leftOnly && rightOnly) return rightOnly
      // If both exist, create a synthetic parent to preserve structure
      if (leftOnly && rightOnly) {
        return {
          value: midValue,
          path: `path${mid}`,
          left: leftOnly,
          right: rightOnly,
        }
      }
      return null
    }

    return {
      value: midValue,
      path: `path${mid}`,
      left: buildTree(arr, start, mid),
      right: buildTree(arr, mid + 1, end),
    }
  }

  // Layout the tree top-to-bottom with x centered per level and y by depth
  const layoutTree = (root) => {
    if (!root) return null
    const levels = []
    const traverse = (node, depth) => {
      if (!node) return
      if (!levels[depth]) levels[depth] = []
      levels[depth].push(node)
      traverse(node.left, depth + 1)
      traverse(node.right, depth + 1)
    }
    traverse(root, 0)

    const verticalSpacing = 80
    const horizontalSpacing = 120

    // Assign coordinates: y based on depth (top-to-bottom), x based on index within level centered around mid
    levels.forEach((nodesAtLevel, depth) => {
      const count = nodesAtLevel.length
      const totalWidth = (count - 1) * horizontalSpacing
      nodesAtLevel.forEach((node, index) => {
        node.x = (svgWidth / 2) - (totalWidth / 2) + index * horizontalSpacing
        node.y = 40 + depth * verticalSpacing
      })
    })
    return root
  }

  const treeRoot = layoutTree(buildTree(visualArray))

  // Initialize dataset input from baseArray on mount
  useEffect(() => {
    if (!datasetInput) {
      setDatasetInput(baseArray.join(', '))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onApplyDataset = (e) => {
    e?.preventDefault?.()
    setDatasetError('')
    const parts = datasetInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    if (parts.length === 0) {
      setDatasetError('Please enter at least one number separated by commas.')
      return
    }

    const numbers = []
    for (const p of parts) {
      if (!/^[-+]?\d*(\.\d+)?$/.test(p) || p === '' || p === '+' || p === '-' || p === '.' || p === '+.' || p === '-.') {
        setDatasetError('Please enter only numeric values separated by commas (e.g., 5, 3, 8, 1, 2).')
        return
      }
      const n = Number(p)
      if (!Number.isFinite(n)) {
        setDatasetError('One or more values are not valid numbers.')
        return
      }
      numbers.push(n)
    }

    setIsPlaying(false)
    setCurrentStepIndex(-1)
    setBaseArray(numbers)
    setDatasetInput(numbers.join(', '))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header
        algorithm={algorithm}
        onAlgorithmChange={setAlgorithm}
        mode={mode}
        onModeChange={setMode}
        isSearch={algorithm === 'linearSearch' || algorithm === 'binarySearch'}
        target={searchTarget}
        onTargetChange={setSearchTarget}
      />
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-4 px-4 py-6">
        {/* Sidebar */}
        <Sidebar current={section} onSelect={setSection} algorithm={algorithm} onAlgorithmChange={setAlgorithm} />

        {/* Main content */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{algorithm === 'bubbleSort' ? 'Bubble Sort' : algorithm === 'quickSort' ? 'Quick Sort' : algorithm === 'mergeSort' ? 'Merge Sort' : algorithm === 'insertionSort' ? 'Insertion Sort' : algorithm === 'selectionSort' ? 'Selection Sort' : algorithm === 'binarySearch' ? 'Binary Search' : 'Linear Search'}</h2>
              <p className="text-xs text-gray-500">Enter numbers separated by commas to visualize.</p>
            </div>
            <form onSubmit={onApplyDataset} className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <input
                value={datasetInput}
                onChange={(e) => setDatasetInput(e.target.value)}
                placeholder="e.g., 5, 3, 8, 1, 2"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex gap-2">
                <button type="submit" className="px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white shadow">Apply</button>
                <button type="button" onClick={onShuffle} className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow">Shuffle</button>
              </div>
            </form>
          </div>
          {datasetError && <div className="text-sm text-red-600">{datasetError}</div>}

          <VisualizerCanvas
            mode={mode}
            array={visualArray}
            svgWidth={svgWidth}
            svgHeight={svgHeight}
            treeRoot={treeRoot}
            comparingIndices={comparingIndices}
            swappedIndices={swappedIndices}
            foundIndices={foundIndices}
          />

          <div className="text-sm text-gray-600 text-center">
            <span>Step: {Math.max(0, currentStepIndex + 1)} / {steps.length}</span>
            {isFinished && (
              <span className="ml-2 text-green-600 font-medium">Sorted!</span>
            )}
          </div>

          <ExplanationPanel step={currentStep} isFinished={isFinished} />
        </div>
      </div>

      <ControlsPanel
        canPlay={canPlay}
        isPlaying={isPlaying}
        onPlay={onPlay}
        onPause={onPause}
        onStep={onStep}
        onReset={onReset}
        speedMs={speedMs}
        setSpeedMs={setSpeedMs}
      />
    </div>
  )
}
