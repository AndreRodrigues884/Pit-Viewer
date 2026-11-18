import { describe, expect, it } from 'vitest'
import { evaluateGame, type Goal } from './goal'
import type { MiningSummary } from './summary'

const goal: Goal = { oreTonnes: 1000, maxBlocks: 10 }

const summary = (overrides: Partial<MiningSummary>): MiningSummary => ({
  blocksMined: 0,
  oreTonnes: 0,
  wasteTonnes: 0,
  revenue: 0,
  cost: 0,
  profit: 0,
  stripRatio: null,
  ...overrides,
})

describe('evaluateGame', () => {
  it('keeps playing while the target is not reached and blocks remain', () => {
    expect(evaluateGame(summary({ blocksMined: 5, oreTonnes: 500, profit: 10 }), goal)).toBe(
      'playing',
    )
  })

  it('is won when the ore target is reached with a profit', () => {
    expect(evaluateGame(summary({ blocksMined: 7, oreTonnes: 1000, profit: 1 }), goal)).toBe('won')
  })

  it('is not won while the operation is losing money', () => {
    expect(evaluateGame(summary({ blocksMined: 7, oreTonnes: 1200, profit: -5 }), goal)).toBe(
      'playing',
    )
  })

  it('is won on the last block if the target is reached', () => {
    expect(evaluateGame(summary({ blocksMined: 10, oreTonnes: 1000, profit: 1 }), goal)).toBe(
      'won',
    )
  })

  it('is lost when the block budget runs out first', () => {
    expect(evaluateGame(summary({ blocksMined: 10, oreTonnes: 900, profit: 50 }), goal)).toBe(
      'lost',
    )
  })
})
