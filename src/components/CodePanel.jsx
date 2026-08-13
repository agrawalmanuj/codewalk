import { useEffect, useRef } from 'react'

export default function CodePanel({ code, activeLine }) {
  const lines = code.split('\n')
  const activeRef = useRef(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [activeLine])

  return (
    <pre className="code-panel">
      <code>
        {lines.map((line, idx) => {
          const lineNumber = idx + 1
          const isActive = lineNumber === activeLine
          return (
            <div
              key={lineNumber}
              ref={isActive ? activeRef : null}
              className={`code-panel__line${isActive ? ' code-panel__line--active' : ''}`}
            >
              <span className="code-panel__line-number">{lineNumber}</span>
              <span className="code-panel__line-text">{line || ' '}</span>
            </div>
          )
        })}
      </code>
    </pre>
  )
}
