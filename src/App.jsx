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

  // Compute dynamic canvas size BEFORE building visualization frames
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  useEffect(() => {
    const onResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const headerH = 64 // matches spacer h-16
  const bottomH = 72 // sticky controls approx height
  const isDesktop = windowSize.width >= 768 // md breakpoint
  const sidebarW = isDesktop ? 288 : 0 // md:w-72 ~ 18rem
  const horizPad = 48 // approx container horizontal padding
  const vertPad = 48 // approx container vertical padding
  const svgWidth = Math.max(300, windowSize.width - sidebarW - horizPad)
  const svgHeight = Math.max(200, windowSize.height - headerH - bottomH - vertPad)

  // Build visualization frames depending on mode
  const visFrames = useMemo(() => {
    if (mode === 'array') return buildArrayAnimation(steps, svgWidth, svgHeight)
    if (mode === 'nodes') return buildNodeAnimation(steps, svgWidth, svgHeight)
    return null
  }, [mode, steps, svgWidth, svgHeight])
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
  const foundIndices = currentStep && currentStep.found ? (currentStep.comparing ?? []) : []
  const sortedIndices = currentStep && currentStep.sortedIndices ? currentStep.sortedIndices : (isFinished ? visualArray.map((_, idx) => idx) : [])

  // (windowSize/svg dims already computed above)

  // Build animation frames for Array mode: evenly spaced row positions
  const buildArrayAnimation = (algoSteps, width, height) => {
    const frames = []
    const padX = 24
    const gap = 8
    const rowY = Math.max(60, Math.min(height - 60, Math.floor(height / 2)))
    for (const step of algoSteps) {
      const n = step.array.length
      const usable = Math.max(1, width - padX * 2 - gap * (n - 1))
      const cellW = Math.max(28, Math.floor(usable / n))
      const positions = []
      let x = padX
      for (let idx = 0; idx < n; idx += 1) {
        positions.push({ index: idx, x, y: rowY, width: cellW })
        x += cellW + gap
      }
      frames.push({
        positions,
        comparing: step.comparing ?? [],
        swapped: !!step.swapped,
        found: !!step.found,
        sortedIndices: step.sortedIndices ?? [],
      })
    }
    return frames
  }

  // Build animation frames for Node mode: pseudo-random scatter, swap positions when swaps occur
  const buildNodeAnimation = (algoSteps, width, height) => {
    const frames = []
    if (algoSteps.length === 0) return frames
    const n = algoSteps[0].array.length
    const padPct = 10
    const rng = (i, seed) => {
      const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453
      return x - Math.floor(x)
    }
    // initial positions (percent) for indices 0..n-1
    const posPct = Array.from({ length: n }, (_, i) => ({
      xPct: padPct + rng(i, 1) * (100 - 2 * padPct),
      yPct: padPct + rng(i, 2) * (100 - 2 * padPct),
    }))
    for (const step of algoSteps) {
      // clone
      const snapshot = posPct.map(p => ({ ...p }))
      if (step.swapped && Array.isArray(step.comparing) && step.comparing.length === 2) {
        const [a, b] = step.comparing
        // swap target positions for indices a and b
        const tmp = snapshot[a]
        snapshot[a] = snapshot[b]
        snapshot[b] = tmp
        // also update base for next steps
        const tmpBase = posPct[a]
        posPct[a] = posPct[b]
        posPct[b] = tmpBase
      }
      frames.push({
        positions: snapshot,
        comparing: step.comparing ?? [],
        swapped: !!step.swapped,
        found: !!step.found,
        sortedIndices: step.sortedIndices ?? [],
      })
    }
    return frames
  }

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
      index: mid,
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
      // Pre-order but push right first so left children appear first in layout
      // This reverses the previous left-to-right bias so leaves tend to fill left side first
      levels[depth].push(node)
      traverse(node.right, depth + 1)
      traverse(node.left, depth + 1)
    }
    traverse(root, 0)

    const verticalSpacing = Math.max(60, Math.floor(svgHeight / 6))
    const horizontalSpacing = Math.max(100, Math.floor(svgWidth / 10))

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
      <div className="h-16" />
      <div className="w-full h-full flex-1 min-h-0 px-4 sm:px-6 lg:px-12 py-8 grid grid-cols-1 md:grid-cols-[18rem_1fr] gap-6">
        {/* Sidebar */}
        <Sidebar current={section} onSelect={setSection} algorithm={algorithm} onAlgorithmChange={setAlgorithm} />

        {/* Main content */}
        <div className="flex flex-col gap-6 h-full min-h-0">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{algorithm === 'bubbleSort' ? 'Bubble Sort' : algorithm === 'quickSort' ? 'Quick Sort' : algorithm === 'mergeSort' ? 'Merge Sort' : algorithm === 'insertionSort' ? 'Insertion Sort' : algorithm === 'selectionSort' ? 'Selection Sort' : algorithm === 'binarySearch' ? 'Binary Search' : 'Linear Search'}</h2>
              <p className="text-sm text-gray-500">Enter numbers separated by commas to visualize.</p>
            </div>
            <form onSubmit={onApplyDataset} className="flex flex-wrap gap-3 items-center justify-center w-full md:w-auto">
              <input
                value={datasetInput}
                onChange={(e) => setDatasetInput(e.target.value)}
                placeholder="e.g., 5, 3, 8, 1, 2"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm min-w-[260px]"
              />
              <div className="flex gap-3">
                <button type="submit" className="px-4 py-2 rounded-lg shadow-sm font-semibold text-white transition-colors duration-200 bg-gradient-to-r from-sky-400 to-teal-400 hover:from-sky-500 hover:to-teal-500">Apply</button>
                <button type="button" onClick={onShuffle} className="px-4 py-2 rounded-lg shadow-sm font-semibold text-white transition-colors duration-200 bg-gray-800 hover:bg-gray-900">Shuffle</button>
              </div>
            </form>
          </div>
          {datasetError && <div className="text-sm text-red-600">{datasetError}</div>}

          <div className="grid grid-cols-1 gap-6 flex-1 min-h-0">
            <VisualizerCanvas
            mode={mode}
            array={visualArray}
            svgWidth={svgWidth}
            svgHeight={svgHeight}
            treeRoot={treeRoot}
            comparingIndices={comparingIndices}
            swappedIndices={swappedIndices}
            foundIndices={foundIndices}
            sortedIndices={sortedIndices}
            frames={visFrames}
            frameIndex={currentStepIndex}
            />
          </div>

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
