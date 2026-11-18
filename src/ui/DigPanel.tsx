import { blockValue } from '../game/economy'
import { BLOCK_LABELS } from '../scene/blockTypes'
import type { DigResult } from '../viewer/createViewer'
import { formatCurrency } from './format'

interface DigPanelProps {
  result: DigResult | null
}

export function DigPanel({ result }: DigPanelProps) {
  return (
    <aside className="panel" aria-label="Dig">
      <h2>Dig</h2>
      {result ? <DigMessage result={result} /> : null}
      <p className="hint">
        Click a block to mine it. A block can only be mined once the 3 × 3 blocks above it are
        gone.
      </p>
    </aside>
  )
}

function DigMessage({ result }: { result: DigResult }) {
  const label = BLOCK_LABELS[result.block.type]

  if (!result.mined) {
    return <p className="message negative">{label} block is blocked. Clear the blocks above it first.</p>
  }

  const { value } = blockValue(result.block)
  return (
    <p className="message">
      Mined {label.toLowerCase()} block ·{' '}
      <span className={value >= 0 ? 'positive' : 'negative'}>{formatCurrency(value)}</span>
      <br />
      Blocks mined: {result.minedCount}
    </p>
  )
}
