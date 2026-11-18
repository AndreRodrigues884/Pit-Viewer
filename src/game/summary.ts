import type { Block } from '../scene/blockModel'
import { blockValue, DEFAULT_ECONOMY, type Economy } from './economy'

export interface MiningSummary {
  blocksMined: number
  oreTonnes: number
  wasteTonnes: number
  revenue: number
  cost: number
  profit: number
  stripRatio: number | null
}

export function summarize(
  minedBlocks: readonly Block[],
  economy: Economy = DEFAULT_ECONOMY,
): MiningSummary {
  const summary = minedBlocks.reduce(
    (totals, block) => {
      const { tonnes, revenue, cost } = blockValue(block, economy)
      if (block.type === 'ore') totals.oreTonnes += tonnes
      else totals.wasteTonnes += tonnes
      totals.revenue += revenue
      totals.cost += cost
      return totals
    },
    { oreTonnes: 0, wasteTonnes: 0, revenue: 0, cost: 0 },
  )

  return {
    ...summary,
    blocksMined: minedBlocks.length,
    profit: summary.revenue - summary.cost,
    stripRatio: summary.oreTonnes > 0 ? summary.wasteTonnes / summary.oreTonnes : null,
  }
}
