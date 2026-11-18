import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CameraRig, type CameraMode } from '../camera/CameraRig'
import { createScene } from '../scene/createScene'

export interface ViewerHandle {
  setCameraMode: (mode: CameraMode) => void
  setShadows: (enabled: boolean) => void
  dispose: () => void
}

export function createViewer(container: HTMLElement): ViewerHandle {
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  container.appendChild(renderer.domElement)

  const pit = createScene()

  const cameras = new CameraRig()
  cameras.perspective.position.set(38, 32, 38)

  const controls = new OrbitControls(cameras.active, renderer.domElement)
  controls.enableDamping = true
  controls.target.set(0, 2, 0)
  controls.maxPolarAngle = Math.PI / 2 - 0.05

  const resize = () => {
    const { clientWidth: width, clientHeight: height } = container
    renderer.setSize(width, height)
    cameras.setAspect(width / height)
  }
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container)
  resize()

  let frameId = 0
  const animate = () => {
    frameId = requestAnimationFrame(animate)
    controls.update()
    renderer.render(pit.scene, cameras.active)
  }
  animate()

  return {
    setCameraMode(mode) {
      cameras.setMode(mode, controls.target)
      controls.object = cameras.active
      controls.update()
    },
    setShadows(enabled) {
      pit.lights.directional.castShadow = enabled
    },
    dispose() {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      controls.dispose()
      pit.dispose()
      renderer.dispose()
      container.removeChild(renderer.domElement)
    },
  }
}
