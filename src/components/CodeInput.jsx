const EXAMPLE = `function fibonacci(n) {
  let a = 0
  let b = 1

  for (let i = 0; i < n; i++) {
    const next = a + b
    a = b
    b = next
  }

  return a
}`

export default function CodeInput({ code, setCode, onSubmit, loading, error }) {
  return (
    <div className="code-input">
      <textarea
        className="code-input__textarea"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste a code snippet here..."
        spellCheck={false}
        rows={14}
      />
      <div className="code-input__actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => setCode(EXAMPLE)}
          disabled={loading}
        >
          Use example
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={onSubmit}
          disabled={loading || !code.trim()}
        >
          {loading ? 'Generating walkthrough…' : 'Explain this code'}
        </button>
      </div>
      {error && <p className="code-input__error">{error}</p>}
    </div>
  )
}
