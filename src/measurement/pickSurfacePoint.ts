import type { Object3D, Raycaster, Vector3 } from 'three'
import type { Terrain } from '../scene/terrain'

export function pickSurfacePoint(
  raycaster: Raycaster,
  terrain: Terrain,
  ground: Object3D,
): Vector3 | null {
  for (const hit of raycaster.intersectObjects([...terrain.meshes, ground], false)) {
    if (hit.object === ground) return hit.point
    const block = hit.instanceId === undefined ? undefined : terrain.getBlock(hit.object, hit.instanceId)
    if (block && terrain.isVisible(block)) return hit.point
  }
  return null
}
