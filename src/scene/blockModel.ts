import { Vector3 } from 'three'
import type { BlockType } from './blockTypes'

export interface GridCell {
  i: number
  j: number
  level: number
}

export interface Block extends GridCell {
  type: BlockType
  grade: number
  size: number
  position: Vector3
}

export interface PitConfig {
  size: number
  levels: number
  blockSize: number
  pitBottomLevel: number
  bottomRadius: number
  benchWidth: number
}

export const DEFAULT_PIT: PitConfig = {
  size: 40,
  levels: 8,
  blockSize: 10,
  pitBottomLevel: 5,
  bottomRadius: 4,
  benchWidth: 2,
}

export const MIN_ORE_GRADE = 0.3
export const MAX_ORE_GRADE = 2

function isExcavated(x: number, level: number, z: number, config: PitConfig): boolean {
  if (level < config.pitBottomLevel) return false
  const pitRadius = config.bottomRadius + (level - config.pitBottomLevel) * config.benchWidth
  return Math.hypot(x, z) < pitRadius
}

function oreBodyDistance(x: number, level: number, z: number): number {
  return Math.sqrt(((x - 4) / 9) ** 2 + ((level - 2) / 3) ** 2 + ((z + 3) / 6) ** 2)
}

function gradeAt(distanceFromCore: number): number {
  const grade = MIN_ORE_GRADE + (MAX_ORE_GRADE - MIN_ORE_GRADE) * (1 - distanceFromCore)
  return Math.round(grade * 100) / 100
}

function classify(x: number, level: number, z: number, config: PitConfig) {
  if (level === config.levels - 1) return { type: 'soil' as const, grade: 0 }
  const distanceFromCore = oreBodyDistance(x, level, z)
  if (distanceFromCore < 1) return { type: 'ore' as const, grade: gradeAt(distanceFromCore) }
  return { type: 'waste' as const, grade: 0 }
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
          i,
          j,
          level,
          ...classify(x, level, z, config),
          size: config.blockSize,
          position: new Vector3(x, level + 0.5, z).multiplyScalar(config.blockSize),
        })
      }
    }
  }

  return blocks
}
