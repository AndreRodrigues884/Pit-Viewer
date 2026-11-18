import * as THREE from 'three'

export type CameraMode = 'perspective' | 'orthographic'

const FOV = 50
const HALF_FOV_TAN = Math.tan(THREE.MathUtils.degToRad(FOV / 2))

export class CameraRig {
  readonly perspective = new THREE.PerspectiveCamera(FOV, 1, 0.1, 1000)
  readonly orthographic = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000)
  active: THREE.PerspectiveCamera | THREE.OrthographicCamera = this.perspective
  private aspect = 1

  setAspect(aspect: number) {
    this.aspect = aspect
    this.perspective.aspect = aspect
    this.perspective.updateProjectionMatrix()
    this.setOrthographicHeight(this.orthographic.top - this.orthographic.bottom)
  }

  setMode(mode: CameraMode, target: THREE.Vector3) {
    const next = mode === 'perspective' ? this.perspective : this.orthographic
    if (next === this.active) return

    const height = this.visibleHeight(target)
    next.position.copy(this.active.position)
    next.quaternion.copy(this.active.quaternion)

    if (next instanceof THREE.OrthographicCamera) {
      next.zoom = 1
      this.setOrthographicHeight(height)
    } else {
      const direction = next.position.clone().sub(target).normalize()
      next.position.copy(target).addScaledVector(direction, height / (2 * HALF_FOV_TAN))
    }

    this.active = next
  }

  private visibleHeight(target: THREE.Vector3): number {
    const camera = this.active
    if (camera instanceof THREE.PerspectiveCamera) {
      return 2 * camera.position.distanceTo(target) * HALF_FOV_TAN
    }
    return (camera.top - camera.bottom) / camera.zoom
  }

  private setOrthographicHeight(height: number) {
    const half = height / 2
    const camera = this.orthographic
    camera.top = half
    camera.bottom = -half
    camera.left = -half * this.aspect
    camera.right = half * this.aspect
    camera.updateProjectionMatrix()
  }
}
