import type { Raycaster } from 'three'
import type { Block } from '../scene/blockModel'
import type { Terrain } from '../scene/terrain'

export function pickBlock(raycaster: Raycaster, terrain: Terrain): Block | null {
  for (const hit of raycaster.intersectObjects(terrain.meshes, false)) {
    if (hit.instanceId === undefined) continue
    const block = terrain.getBlock(hit.object, hit.instanceId)
    if (block && terrain.isVisible(block)) return block
  }
  return null
}
