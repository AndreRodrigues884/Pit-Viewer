import type { Raycaster } from 'three'
import type { Block } from '../scene/blockModel'
import type { Terrain } from '../scene/terrain'

export function pickBlock(raycaster: Raycaster, terrain: Terrain): Block | null {
  const [hit] = raycaster.intersectObjects(terrain.meshes, false)
  if (!hit || hit.instanceId === undefined) return null
  return terrain.getBlock(hit.object, hit.instanceId) ?? null
}
