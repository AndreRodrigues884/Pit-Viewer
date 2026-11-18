import { blockValue } from '../game/economy'
import type { Block } from '../scene/blockModel'
import { BLOCK_COLORS, BLOCK_LABELS } from '../scene/blockTypes'
import { formatCurrency, formatGrade, formatPoint, formatTonnes } from './format'

interface BlockPanelProps {
  block: Block | null
}

export function BlockPanel({ block }: BlockPanelProps) {
  if (!block) {
    return (
      <aside className="panel" aria-label="Selected block">
        <h2>Selected block</h2>
        <p className="hint">Click a block to inspect it.</p>
      </aside>
    )
  }

  const { tonnes, value } = blockValue(block)

  return (
    <aside className="panel" aria-label="Selected block">
      <h2>Selected block</h2>
      <dl>
        <dt>Type</dt>
        <dd>
          <span className="swatch" style={{ background: BLOCK_COLORS[block.type] }} />
          {BLOCK_LABELS[block.type]}
        </dd>
        <dt>Position</dt>
        <dd>{formatPoint(block.position)}</dd>
        <dt>Grade</dt>
        <dd>{block.type === 'ore' ? formatGrade(block.grade) : '—'}</dd>
        <dt>Tonnage</dt>
        <dd>{formatTonnes(tonnes)}</dd>
        <dt>Value</dt>
        <dd className={value >= 0 ? 'positive' : 'negative'}>{formatCurrency(value)}</dd>
      </dl>
    </aside>
  )
}
