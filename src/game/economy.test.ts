import { describe, expect, it } from 'vitest'
import { blockTonnes, blockValue, type Economy } from './economy'

const economy: Economy = {
  densityTonnesPerM3: 2,
  metalPricePerTonne: 1000,
  recovery: 0.5,
  miningCostPerTonne: 1,
  processingCostPerTonne: 4,
}

describe('blockTonnes', () => {
  it('multiplies the block volume by the rock density', () => {
    expect(blockTonnes({ size: 10 }, economy)).toBe(2000)
  })
})

describe('blockValue', () => {
  it('charges only the mining cost for waste', () => {
    expect(blockValue({ type: 'waste', grade: 0, size: 10 }, economy)).toEqual({
      tonnes: 2000,
      revenue: 0,
      cost: 2000,
      value: -2000,
    })
  })

  it('treats soil like waste', () => {
    expect(blockValue({ type: 'soil', grade: 0, size: 10 }, economy).value).toBe(-2000)
  })

  it('pays for recovered metal and charges mining plus processing for ore', () => {
    expect(blockValue({ type: 'ore', grade: 2, size: 10 }, economy)).toEqual({
      tonnes: 2000,
      revenue: 20000,
      cost: 10000,
      value: 10000,
    })
  })

  it('breaks even when revenue equals the total cost', () => {
    expect(blockValue({ type: 'ore', grade: 1, size: 10 }, economy).value).toBe(0)
  })

  it('gives higher grade ore a higher value', () => {
    const low = blockValue({ type: 'ore', grade: 0.5, size: 10 }, economy)
    const high = blockValue({ type: 'ore', grade: 1.5, size: 10 }, economy)
    expect(high.value).toBeGreaterThan(low.value)
  })
})
