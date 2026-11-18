import type { Block } from '../scene/blockModel'
import { cellKey, isExposed } from './precedence'

export class Excavation {
  private readonly remaining: Set<string>
  private readonly mined: Block[] = []

  constructor(blocks: Block[]) {
    this.remaining = new Set(blocks.map(cellKey))
  }

  get minedBlocks(): readonly Block[] {
    return this.mined
  }

  canMine(block: Block): boolean {
    return this.remaining.has(cellKey(block)) && isExposed(block, this.remaining)
  }

  mine(block: Block): boolean {
    if (!this.canMine(block)) return false
    this.remaining.delete(cellKey(block))
    this.mined.push(block)
    return true
  }
}
