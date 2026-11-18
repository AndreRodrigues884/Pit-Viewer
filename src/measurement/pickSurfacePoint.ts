import type { Object3D, Raycaster, Vector3 } from 'three'

export function pickSurfacePoint(raycaster: Raycaster, targets: Object3D[]): Vector3 | null {
  const [hit] = raycaster.intersectObjects(targets, false)
  return hit ? hit.point : null
}
