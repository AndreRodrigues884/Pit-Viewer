import type { MiningSummary } from './summary'

export interface Goal {
  oreTonnes: number
  maxBlocks: number
}

export type GameStatus = 'playing' | 'won' | 'lost'

export const DEFAULT_GOAL: Goal = {
  oreTonnes: 64_800,
  maxBlocks: 50,
}

export function evaluateGame(summary: MiningSummary, goal: Goal = DEFAULT_GOAL): GameStatus {
  if (summary.oreTonnes >= goal.oreTonnes && summary.profit > 0) return 'won'
  if (summary.blocksMined >= goal.maxBlocks) return 'lost'
  return 'playing'
}
