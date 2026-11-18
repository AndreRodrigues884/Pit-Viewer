import { describe, expect, it } from 'vitest'
import { DEFAULT_PIT, MAX_ORE_GRADE, MIN_ORE_GRADE, generateBlocks } from './blockModel'

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
