import React, { useEffect, useMemo, useRef, useState } from 'react'
import './index.css'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import VisualizerCanvas from './components/VisualizerCanvas'
import ControlsPanel from './components/ControlsPanel'
import ExplanationPanel from './components/ExplanationPanel'
import { bubbleSortSteps } from './algorithms/bubbleSortSteps'

export default function App() {
  const [section, setSection] = useState('sorting')
  const [algorithm, setAlgorithm] = useState('bubbleSort')
  const [baseArray, setBaseArray] = useState(() =>
    Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1)
  )
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speedMs, setSpeedMs] = useState(300)
  const intervalRef = useRef(null)

  const steps = useMemo(() => {
    // Future: branch for different algorithms
    // For Bubble Sort, we generate steps comparing and swapping indices
    // Each step snapshot is a new array (no in-place mutation)
    return bubbleSortSteps(baseArray)
  }, [baseArray, algorithm])
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
    setBaseArray(
      Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1)
    )
  }

  const visualArray = currentStep ? currentStep.array : baseArray
  const comparingIndices = currentStep
    ? currentStep.comparing.map(idx => `path${idx}`)
    : []
  const swappedIndices = isFinished
    ? visualArray.map((_, idx) => `path${idx}`)
    : currentStep && currentStep.swapped
    ? currentStep.comparing.map(idx => `path${idx}`)
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header algorithm={algorithm} onAlgorithmChange={setAlgorithm} />
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-4 px-4 py-6">
        {/* Sidebar */}
        <Sidebar current={section} onSelect={setSection} algorithm={algorithm} onAlgorithmChange={setAlgorithm} />

        {/* Main content */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Bubble Sort</h2>
            <button onClick={onShuffle} className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow">
              Shuffle
            </button>
          </div>

          <VisualizerCanvas
            svgWidth={svgWidth}
            svgHeight={svgHeight}
            treeRoot={treeRoot}
            comparingIndices={comparingIndices}
            swappedIndices={swappedIndices}
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
