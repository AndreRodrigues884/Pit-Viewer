import { describe, expect, it } from 'vitest'
import { distance } from './distance'

describe('distance', () => {
  it('is zero for the same point', () => {
    expect(distance({ x: 3, y: -2, z: 7 }, { x: 3, y: -2, z: 7 })).toBe(0)
  })

  it('measures along a single axis', () => {
    expect(distance({ x: 0, y: 0, z: 0 }, { x: 0, y: 5, z: 0 })).toBe(5)
  })

  it('measures the straight-line distance in 3D', () => {
    expect(distance({ x: 1, y: 2, z: 3 }, { x: 4, y: 6, z: 15 })).toBe(13)
  })

  it('works with negative coordinates', () => {
    expect(distance({ x: -1, y: -2, z: -2 }, { x: 0, y: 0, z: 0 })).toBe(3)
  })

  it('does not depend on the order of the points', () => {
    const a = { x: 1.5, y: -4, z: 9 }
    const b = { x: -3, y: 2.25, z: 0.5 }
    expect(distance(a, b)).toBeCloseTo(distance(b, a))
  })
})
