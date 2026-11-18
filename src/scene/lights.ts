import * as THREE from 'three'

export interface Lights {
  ambient: THREE.AmbientLight
  directional: THREE.DirectionalLight
}

export function createLights(extent: number): Lights {
  const ambient = new THREE.AmbientLight('#ffffff', 0.8)

  const directional = new THREE.DirectionalLight('#ffffff', 2.5)
  directional.position.set(0.75, 1.25, 0.5).multiplyScalar(extent)
  directional.castShadow = true
  directional.shadow.mapSize.set(2048, 2048)
  directional.shadow.bias = -0.0005

  const shadowCamera = directional.shadow.camera
  shadowCamera.left = -extent
  shadowCamera.right = extent
  shadowCamera.top = extent
  shadowCamera.bottom = -extent
  shadowCamera.near = 1
  shadowCamera.far = extent * 4

  return { ambient, directional }
}
