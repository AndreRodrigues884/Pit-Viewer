import { describe, expect, it } from 'vitest'
import {
  DEFAULT_PIT,
  MAX_ORE_GRADE,
  MIN_ORE_GRADE,
  generateBlocks,
  normalizeConfig,
} from './blockModel'

const config = DEFAULT_PIT
const blocks = generateBlocks(config)

const blocksOnLevel = (level: number) => blocks.filter((block) => block.level === level)

describe('generateBlocks', () => {
  it('keeps every level below the pit bottom complete', () => {
    for (let level = 0; level < config.pitBottomLevel; level++) {
      expect(blocksOnLevel(level)).toHaveLength(config.size * config.size)
    }
  })

  it('opens the pit wider on every level going up', () => {
    for (let level = config.pitBottomLevel + 1; level < config.levels; level++) {
      expect(blocksOnLevel(level).length).toBeLessThan(blocksOnLevel(level - 1).length)
    }
  })

  it('covers the top level with soil', () => {
    expect(blocksOnLevel(config.levels - 1).every((block) => block.type === 'soil')).toBe(true)
  })

  it('gives every ore block a grade inside the expected range', () => {
    const ore = blocks.filter((block) => block.type === 'ore')
    expect(ore.length).toBeGreaterThan(0)
    for (const block of ore) {
      expect(block.grade).toBeGreaterThanOrEqual(MIN_ORE_GRADE)
      expect(block.grade).toBeLessThanOrEqual(MAX_ORE_GRADE)
    }
  })

  it('gives waste and soil no grade', () => {
    const barren = blocks.filter((block) => block.type !== 'ore')
    expect(barren.every((block) => block.grade === 0)).toBe(true)
  })
})

describe('normalizeConfig', () => {
  it('leaves a valid config unchanged', () => {
    expect(normalizeConfig(DEFAULT_PIT)).toEqual(DEFAULT_PIT)
  })

  it('clamps values to their allowed range', () => {
    const config = normalizeConfig({ ...DEFAULT_PIT, size: 500, levels: 1, benchWidth: 0 })
    expect(config.size).toBe(60)
    expect(config.levels).toBe(4)
    expect(config.benchWidth).toBe(1)
  })

  it('keeps the pit floor and the ore body inside the model', () => {
    const config = normalizeConfig({ ...DEFAULT_PIT, levels: 5, pitBottomLevel: 9, oreLevel: 9 })
    expect(config.pitBottomLevel).toBe(4)
    expect(config.oreLevel).toBe(3)
  })

  it('rounds slider values to whole numbers', () => {
    expect(normalizeConfig({ ...DEFAULT_PIT, bottomRadius: 3.6 }).bottomRadius).toBe(4)
  })
})
