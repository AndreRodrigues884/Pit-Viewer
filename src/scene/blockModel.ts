import { Vector3 } from 'three'
import type { BlockType } from './blockTypes'

export interface Block {
  type: BlockType
  position: Vector3
}

export interface PitConfig {
  size: number
  levels: number
  blockSize: number
  bottomRadius: number
  benchWidth: number
}

export const DEFAULT_PIT: PitConfig = {
  size: 40,
  levels: 8,
  blockSize: 1,
  bottomRadius: 5,
  benchWidth: 2,
}

function isExcavated(x: number, level: number, z: number, config: PitConfig): boolean {
  if (level === 0) return false
  const pitRadius = config.bottomRadius + (level - 1) * config.benchWidth
  return Math.hypot(x, z) < pitRadius
}

function isOre(x: number, level: number, z: number): boolean {
  return ((x - 4) / 9) ** 2 + ((level - 2) / 3) ** 2 + ((z + 3) / 6) ** 2 < 1
}

function classify(x: number, level: number, z: number, config: PitConfig): BlockType {
  if (level === config.levels - 1) return 'soil'
  return isOre(x, level, z) ? 'ore' : 'waste'
}

export function generateBlocks(config: PitConfig = DEFAULT_PIT): Block[] {
  const blocks: Block[] = []
  const half = (config.size - 1) / 2

  for (let level = 0; level < config.levels; level++) {
    for (let i = 0; i < config.size; i++) {
      for (let j = 0; j < config.size; j++) {
        const x = i - half
        const z = j - half
        if (isExcavated(x, level, z, config)) continue

        blocks.push({
          type: classify(x, level, z, config),
          position: new Vector3(x, level + 0.5, z).multiplyScalar(config.blockSize),
        })
      }
    }
  }

  return blocks
}
