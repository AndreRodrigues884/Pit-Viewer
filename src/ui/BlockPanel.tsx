import type { Block } from '../scene/blockModel'
import { BLOCK_COLORS, BLOCK_LABELS } from '../scene/blockTypes'
import { formatPoint } from './formatPoint'

interface BlockPanelProps {
  block: Block | null
}

export function BlockPanel({ block }: BlockPanelProps) {
  return (
    <aside className="panel" aria-label="Selected block">
      <h2>Selected block</h2>
      {block ? (
        <dl>
          <dt>Type</dt>
          <dd>
            <span className="swatch" style={{ background: BLOCK_COLORS[block.type] }} />
            {BLOCK_LABELS[block.type]}
          </dd>
          <dt>Position</dt>
          <dd>{formatPoint(block.position)}</dd>
        </dl>
      ) : (
        <p className="hint">Click a block to inspect it.</p>
      )}
    </aside>
  )
}
