import React, { useEffect, useMemo, useRef, useState } from 'react'
import './index.css'
import Bars from './components/Bars'
import Controls from './components/Controls'
import ExplanationPanel from './components/ExplanationPanel'
import { bubbleSortSteps } from './algorithms/bubbleSortSteps'

function App() {
  const [baseArray, setBaseArray] = useState(() =>
    Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1)
  )
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speedMs, setSpeedMs] = useState(300)
  const intervalRef = useRef(null)

  const steps = useMemo(() => bubbleSortSteps(baseArray), [baseArray])
  const isFinished = steps.length > 0 && currentStepIndex >= steps.length - 1
  const currentStep = currentStepIndex >= 0 && currentStepIndex < steps.length ? steps[currentStepIndex] : null

  useEffect(() => {
    if (!isPlaying) return
    if (steps.length === 0) return

    intervalRef.current && clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < steps.length - 1) {
          return prev + 1
        }
        clearInterval(intervalRef.current)
        setIsPlaying(false)
        return prev
      })
    }, Math.max(50, speedMs))

    return () => intervalRef.current && clearInterval(intervalRef.current)
  }, [isPlaying, speedMs, steps.length])

  useEffect(() => () => intervalRef.current && clearInterval(intervalRef.current), [])

  const canPlay = !isFinished
  const onPlay = () => { if (canPlay) setIsPlaying(true) }
  const onPause = () => setIsPlaying(false)
  const onReset = () => { setIsPlaying(false); setCurrentStepIndex(-1) }
  const onShuffle = () => {
    setIsPlaying(false)
    setCurrentStepIndex(-1)
    setBaseArray(Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1))
  }

  const visualArray = currentStep ? currentStep.array : baseArray
  const comparingIndices = currentStep ? currentStep.comparing : []
  const swappedIndices = isFinished
    ? visualArray.map((_, idx) => idx)
    : currentStep && currentStep.swapped
    ? currentStep.comparing
    : []

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-8">
      <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Bubble Sort Visualizer</h1>
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
          min={100}
          max={2000}
        />

        <Bars
          array={visualArray}
          comparingIndices={comparingIndices}
          swappedIndices={swappedIndices}
          height={260}
          gap={6}
          padding={12}
        />

        <div className="mt-3 text-sm text-gray-600">
          <span>Step: {Math.max(0, currentStepIndex + 1)} / {steps.length}</span>
          {isFinished && <span className="ml-2 text-green-600 font-medium">Sorted!</span>}
        </div>

        <ExplanationPanel step={currentStep} isFinished={isFinished} />
      </div>
    </div>
  )
}

export default App
