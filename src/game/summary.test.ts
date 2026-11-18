import { Vector3 } from 'three'
import { describe, expect, it } from 'vitest'
import type { Block } from '../scene/blockModel'
import type { BlockType } from '../scene/blockTypes'
import type { Economy } from './economy'
import { summarize } from './summary'

const economy: Economy = {
  densityTonnesPerM3: 2,
  metalPricePerTonne: 1000,
  recovery: 0.5,
  miningCostPerTonne: 1,
  processingCostPerTonne: 4,
}

const makeBlock = (type: BlockType, grade = 0): Block => ({
  i: 0,
  j: 0,
  level: 0,
  type,
  grade,
  size: 10,
  position: new Vector3(),
})

describe('summarize', () => {
  it('starts from zero', () => {
    expect(summarize([], economy)).toEqual({
      blocksMined: 0,
      oreTonnes: 0,
      wasteTonnes: 0,
      revenue: 0,
      cost: 0,
      profit: 0,
      stripRatio: null,
    })
  })

  it('adds up tonnes, revenue, cost and profit', () => {
    const summary = summarize([makeBlock('ore', 2), makeBlock('waste'), makeBlock('soil')], economy)

    expect(summary.blocksMined).toBe(3)
    expect(summary.oreTonnes).toBe(2000)
    expect(summary.wasteTonnes).toBe(4000)
    expect(summary.revenue).toBe(20000)
    expect(summary.cost).toBe(14000)
    expect(summary.profit).toBe(6000)
  })

  it('reports the strip ratio as waste tonnes per ore tonne', () => {
    const blocks = [makeBlock('ore', 1), makeBlock('ore', 1), makeBlock('waste')]
    expect(summarize(blocks, economy).stripRatio).toBe(0.5)
  })

  it('has no strip ratio until ore is mined', () => {
    expect(summarize([makeBlock('waste')], economy).stripRatio).toBeNull()
  })
})
