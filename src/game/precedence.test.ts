import { describe, expect, it } from 'vitest'
import { cellKey, cellsAbove, isExposed } from './precedence'

const keys = (...cells: [number, number, number][]) =>
  new Set(cells.map(([i, j, level]) => cellKey({ i, j, level })))

const target = { i: 5, j: 5, level: 2 }

describe('cellsAbove', () => {
  it('returns the 3 × 3 cells on the next level up', () => {
    const cells = cellsAbove(target)
    expect(cells).toHaveLength(9)
    expect(cells.every((cell) => cell.level === 3)).toBe(true)
    expect(cells).toContainEqual({ i: 4, j: 4, level: 3 })
    expect(cells).toContainEqual({ i: 6, j: 6, level: 3 })
  })
})

describe('isExposed', () => {
  it('is true when nothing is left above', () => {
    expect(isExposed(target, keys([5, 5, 2]))).toBe(true)
  })

  it('is false when the block directly above remains', () => {
    expect(isExposed(target, keys([5, 5, 3]))).toBe(false)
  })

  it('is false when a diagonal block above remains', () => {
    expect(isExposed(target, keys([6, 4, 3]))).toBe(false)
  })

  it('ignores blocks outside the 3 × 3 footprint above', () => {
    expect(isExposed(target, keys([7, 5, 3]))).toBe(true)
  })

  it('ignores neighbours on the same level and below', () => {
    expect(isExposed(target, keys([4, 5, 2], [5, 5, 1]))).toBe(true)
  })
})
