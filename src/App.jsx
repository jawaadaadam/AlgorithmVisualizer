import React, { useEffect, useMemo, useRef, useState } from 'react'
import './index.css'
import TreeNode from './components/TreeNode'
import Controls from './components/Controls'
import ExplanationPanel from './components/ExplanationPanel'
import { bubbleSortSteps } from './algorithms/bubbleSortSteps'

export default function App() {
  const [baseArray, setBaseArray] = useState(() =>
    Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1)
  )
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speedMs, setSpeedMs] = useState(300)
  const intervalRef = useRef(null)

  const steps = useMemo(() => bubbleSortSteps(baseArray), [baseArray])
  const currentStep = currentStepIndex >= 0 && currentStepIndex < steps.length ? steps[currentStepIndex] : null
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
  const onReset = () => { setIsPlaying(false); setCurrentStepIndex(-1) }
  const onShuffle = () => {
    setIsPlaying(false)
    setCurrentStepIndex(-1)
    setBaseArray(Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1))
  }

  const visualArray = currentStep ? currentStep.array : baseArray
  const comparingIndices = currentStep ? currentStep.comparing.map(idx => `path${idx}`) : []
  const swappedIndices = isFinished
    ? visualArray.map((_, idx) => `path${idx}`)
    : currentStep && currentStep.swapped
    ? currentStep.comparing.map(idx => `path${idx}`)
    : []

  // Convert array to tree with path labels
  const buildTree = (arr, start = 0, end = arr.length) => {
    if (start >= end) return null
    const mid = Math.floor((start + end) / 2)
    return {
      value: arr[mid],
      path: `path${mid}`,
      left: buildTree(arr, start, mid),
      right: buildTree(arr, mid + 1, end),
    }
  }

  const treeRoot = buildTree(visualArray)

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Bubble Sort Tree Visualizer</h1>
          <button onClick={onShuffle} className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white">Shuffle</button>
        </div>

        <Controls
          canPlay={canPlay}
          isPlaying={isPlaying}
          onPlay={onPlay}
          onPause={onPause}
          onReset={onReset}
          speedMs={speedMs}
          setSpeedMs={setSpeedMs}
        />

        <div className="flex justify-center mt-4 overflow-auto">
          <svg width={1000} height={400}>
            {treeRoot && (
              <TreeNode
                node={treeRoot}
                comparingIndices={comparingIndices}
                swappedIndices={swappedIndices}
                path=""
                x={500}
                y={40}
                horizontalSpacing={400}
              />
            )}
          </svg>
        </div>

        <ExplanationPanel step={currentStep} isFinished={isFinished} />
      </div>
    </div>
  )
}
