import { useEffect, useRef, useState } from 'react'
import CodeInput from './components/CodeInput'
import CodePanel from './components/CodePanel'
import StepVisualizer from './components/StepVisualizer'
import Controls from './components/Controls'
import { explainCode } from './lib/groq'
import './App.css'

const AUTOPLAY_INTERVAL_MS = 2800

function App() {
  const [code, setCode] = useState('')
  const [submittedCode, setSubmittedCode] = useState('')
  const [result, setResult] = useState(null)
  const [stepIndex, setStepIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const timerRef = useRef(null)

  const steps = result?.steps || []
  const currentStep = steps[stepIndex]

  async function handleSubmit() {
    setLoading(true)
    setError('')
    setResult(null)
    setPlaying(false)
    try {
      const data = await explainCode(code)
      setResult(data)
      setSubmittedCode(code)
      setStepIndex(0)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function goTo(index) {
    setStepIndex(Math.max(0, Math.min(index, steps.length - 1)))
  }

  function handleReplay() {
    setStepIndex(0)
    setPlaying(true)
  }

  useEffect(() => {
    if (!playing) return undefined
    if (stepIndex >= steps.length - 1) {
      setPlaying(false)
      return undefined
    }
    timerRef.current = setTimeout(() => {
      setStepIndex((i) => Math.min(i + 1, steps.length - 1))
    }, AUTOPLAY_INTERVAL_MS)
    return () => clearTimeout(timerRef.current)
  }, [playing, stepIndex, steps.length])

  return (
    <div className="app">
      <header className="app__header">
        <h1>Code → Explainer Video</h1>
        <p>Paste a code snippet and watch an animated, step-by-step walkthrough of how it runs.</p>
      </header>

      <CodeInput code={code} setCode={setCode} onSubmit={handleSubmit} loading={loading} error={error} />

      {result && currentStep && (
        <div className="workspace">
          <CodePanel code={submittedCode} activeLine={currentStep.line} />
          <div className="workspace__right">
            <StepVisualizer step={currentStep} stepNumber={stepIndex + 1} totalSteps={steps.length} />
            <Controls
              stepIndex={stepIndex}
              totalSteps={steps.length}
              playing={playing}
              onPrev={() => goTo(stepIndex - 1)}
              onNext={() => goTo(stepIndex + 1)}
              onTogglePlay={() => setPlaying((p) => !p)}
              onReplay={handleReplay}
              onJump={goTo}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
