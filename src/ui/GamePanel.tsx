import { blockValue } from '../game/economy'
import type { GameStatus, Goal } from '../game/goal'
import type { MiningSummary } from '../game/summary'
import { BLOCK_LABELS } from '../scene/blockTypes'
import type { DigResult } from '../viewer/createViewer'
import { formatCurrency, formatTonnes } from './format'

interface GamePanelProps {
  goal: Goal
  summary: MiningSummary
  status: GameStatus
  lastDig: DigResult | null
  customModel: boolean
  showMineable: boolean
  onShowMineableChange: (enabled: boolean) => void
  onNewGame: () => void
}

export function GamePanel({
  goal,
  summary,
  status,
  lastDig,
  customModel,
  showMineable,
  onShowMineableChange,
  onNewGame,
}: GamePanelProps) {
  const progress = Math.min(summary.oreTonnes / goal.oreTonnes, 1)

  return (
    <aside className="panel" aria-label="Extraction challenge">
      <h2>Extraction challenge</h2>
      <p className="goal">
        Mine <strong>{formatTonnes(goal.oreTonnes)}</strong> of ore using at most{' '}
        <strong>{goal.maxBlocks} blocks</strong>, and finish with a profit.
      </p>
      {customModel && (
        <p className="hint">Custom model: the goal is tuned for the default settings.</p>
      )}

      <div className="progress" role="progressbar" aria-valuenow={Math.round(progress * 100)}>
        <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
      </div>

      <dl>
        <dt>Ore</dt>
        <dd>
          {formatTonnes(summary.oreTonnes)} / {formatTonnes(goal.oreTonnes)}
        </dd>
        <dt>Blocks</dt>
        <dd>
          {summary.blocksMined} / {goal.maxBlocks}
        </dd>
        <dt>Revenue</dt>
        <dd>{formatCurrency(summary.revenue)}</dd>
        <dt>Cost</dt>
        <dd>{formatCurrency(summary.cost)}</dd>
        <dt>Profit</dt>
        <dd className={summary.profit >= 0 ? 'positive' : 'negative'}>
          {formatCurrency(summary.profit)}
        </dd>
        <dt>Strip ratio</dt>
        <dd>{summary.stripRatio === null ? '—' : `${summary.stripRatio.toFixed(2)} : 1`}</dd>
      </dl>

      {status === 'playing' ? (
        lastDig && <DigMessage result={lastDig} />
      ) : (
        <p className={`result ${status}`}>
          {status === 'won'
            ? `Target reached! Final profit: ${formatCurrency(summary.profit)}`
            : 'Out of blocks. Try a lower strip ratio next time.'}
        </p>
      )}

      <label className="toggle">
        <input
          type="checkbox"
          checked={showMineable}
          onChange={(event) => onShowMineableChange(event.target.checked)}
        />
        Highlight mineable blocks
      </label>

      <button type="button" className="primary" onClick={onNewGame}>
        New game
      </button>
    </aside>
  )
}

function DigMessage({ result }: { result: DigResult }) {
  const label = BLOCK_LABELS[result.block.type]

  if (!result.mined) {
    return <p className="message negative">{label} block is blocked. Clear the 3 × 3 blocks above it first.</p>
  }

  const { value } = blockValue(result.block)
  return (
    <p className="message">
      Mined {label.toLowerCase()} block:{' '}
      <span className={value >= 0 ? 'positive' : 'negative'}>{formatCurrency(value)}</span>
    </p>
  )
}
