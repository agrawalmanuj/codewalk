import { AnimatePresence, motion } from 'framer-motion'

const ACTION_LABEL = {
  create: 'new',
  update: 'updated',
  read: 'read',
}

export default function StepVisualizer({ step, stepNumber, totalSteps }) {
  if (!step) return null

  const variables = step.variables || []
  const flow = step.flow || []

  return (
    <div className="visualizer">
      <div className="visualizer__header">
        <span className="visualizer__badge">
          Step {stepNumber} / {totalSteps}
        </span>
        <h3 className="visualizer__title">{step.title}</h3>
      </div>

      <p className="visualizer__description">{step.description}</p>

      <AnimatePresence mode="wait">
        <motion.div
          key={step.id ?? stepNumber}
          className="visualizer__body"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          {variables.length > 0 && (
            <div className="var-grid">
              {variables.map((v, i) => (
                <motion.div
                  key={v.name}
                  className={`var-card var-card--${v.action || 'read'}`}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: i * 0.08 }}
                >
                  <span className="var-card__action">{ACTION_LABEL[v.action] || 'read'}</span>
                  <span className="var-card__name">{v.name}</span>
                  <span className="var-card__value">{v.value}</span>
                </motion.div>
              ))}
            </div>
          )}

          {flow.length > 0 && (
            <div className="flow-list">
              {flow.map((f, i) => (
                <motion.div
                  key={`${f.from}-${f.to}-${i}`}
                  className="flow-item"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.1 + i * 0.08 }}
                >
                  <span className="flow-item__node">{f.from}</span>
                  <span className="flow-item__arrow">
                    <motion.span
                      className="flow-item__arrow-line"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3, delay: 0.15 + i * 0.08 }}
                    />
                    →
                  </span>
                  {f.label && <span className="flow-item__label">{f.label}</span>}
                  <span className="flow-item__node">{f.to}</span>
                </motion.div>
              ))}
            </div>
          )}

          {variables.length === 0 && flow.length === 0 && (
            <p className="visualizer__empty">No variable changes in this step.</p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
