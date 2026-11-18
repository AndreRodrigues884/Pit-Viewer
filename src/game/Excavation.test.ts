import { Vector3 } from 'three'
import { describe, expect, it } from 'vitest'
import type { Block } from '../scene/blockModel'
import { Excavation } from './Excavation'

const makeBlock = (i: number, j: number, level: number): Block => ({
  i,
  j,
  level,
  type: 'waste',
  grade: 0,
  size: 10,
  position: new Vector3(i, level, j),
})

describe('Excavation', () => {
  it('only allows a buried block once the block above is mined', () => {
    const lower = makeBlock(0, 0, 0)
    const upper = makeBlock(0, 0, 1)
    const excavation = new Excavation([lower, upper])

    expect(excavation.canMine(lower)).toBe(false)
    expect(excavation.mine(upper)).toBe(true)
    expect(excavation.canMine(lower)).toBe(true)
  })

  it('needs every block in the footprint above to be mined', () => {
    const lower = makeBlock(1, 1, 0)
    const above = [makeBlock(0, 0, 1), makeBlock(2, 2, 1)]
    const excavation = new Excavation([lower, ...above])

    excavation.mine(above[0])
    expect(excavation.canMine(lower)).toBe(false)
    excavation.mine(above[1])
    expect(excavation.canMine(lower)).toBe(true)
  })

  it('refuses blocked and already mined blocks', () => {
    const lower = makeBlock(0, 0, 0)
    const upper = makeBlock(0, 0, 1)
    const excavation = new Excavation([lower, upper])

    expect(excavation.mine(lower)).toBe(false)
    expect(excavation.mine(upper)).toBe(true)
    expect(excavation.mine(upper)).toBe(false)
  })

  it('keeps the mined blocks in order', () => {
    const lower = makeBlock(0, 0, 0)
    const upper = makeBlock(0, 0, 1)
    const excavation = new Excavation([lower, upper])

    excavation.mine(upper)
    excavation.mine(lower)
    expect(excavation.minedBlocks).toEqual([upper, lower])
  })
})
