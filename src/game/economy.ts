import type { Block } from '../scene/blockModel'

export interface Economy {
  densityTonnesPerM3: number
  metalPricePerTonne: number
  recovery: number
  miningCostPerTonne: number
  processingCostPerTonne: number
}

export const DEFAULT_ECONOMY: Economy = {
  densityTonnesPerM3: 2.7,
  metalPricePerTonne: 9000,
  recovery: 0.85,
  miningCostPerTonne: 2.5,
  processingCostPerTonne: 10,
}

export interface BlockValue {
  tonnes: number
  revenue: number
  cost: number
  value: number
}

type ValuedBlock = Pick<Block, 'type' | 'grade' | 'size'>

export function blockTonnes(block: Pick<Block, 'size'>, economy: Economy = DEFAULT_ECONOMY): number {
  return block.size ** 3 * economy.densityTonnesPerM3
}

export function blockValue(block: ValuedBlock, economy: Economy = DEFAULT_ECONOMY): BlockValue {
  const tonnes = blockTonnes(block, economy)
  const miningCost = tonnes * economy.miningCostPerTonne

  if (block.type !== 'ore') {
    return { tonnes, revenue: 0, cost: miningCost, value: -miningCost }
  }

  const metalTonnes = tonnes * (block.grade / 100) * economy.recovery
  const revenue = metalTonnes * economy.metalPricePerTonne
  const cost = miningCost + tonnes * economy.processingCostPerTonne
  return { tonnes, revenue, cost, value: revenue - cost }
}
