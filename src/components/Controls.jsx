export default function Controls({
  stepIndex,
  totalSteps,
  playing,
  onPrev,
  onNext,
  onTogglePlay,
  onReplay,
  onJump,
}) {
  const isLast = stepIndex === totalSteps - 1

  return (
    <div className="controls">
      <div className="controls__buttons">
        <button type="button" className="btn btn--ghost" onClick={onPrev} disabled={stepIndex === 0}>
          ◀ Prev
        </button>
        <button type="button" className="btn btn--primary" onClick={isLast ? onReplay : onTogglePlay}>
          {isLast ? '↺ Replay' : playing ? '⏸ Pause' : '▶ Play'}
        </button>
        <button type="button" className="btn btn--ghost" onClick={onNext} disabled={isLast}>
          Next ▶
        </button>
      </div>
      <div className="controls__dots">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <button
            key={i}
            type="button"
            className={`controls__dot${i === stepIndex ? ' controls__dot--active' : ''}`}
            onClick={() => onJump(i)}
            aria-label={`Go to step ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
