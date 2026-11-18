import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CameraRig, type CameraMode } from '../camera/CameraRig'
import type { Block } from '../scene/blockModel'
import { createScene } from '../scene/createScene'
import { createHighlight } from '../selection/createHighlight'
import { pickBlock } from '../selection/pickBlock'
import { listenForClicks, toNormalizedPointer } from './pointer'

export interface ViewerOptions {
  onSelectBlock: (block: Block | null) => void
}

export interface ViewerHandle {
  setCameraMode: (mode: CameraMode) => void
  setShadows: (enabled: boolean) => void
  dispose: () => void
}

export function createViewer(container: HTMLElement, options: ViewerOptions): ViewerHandle {
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  container.appendChild(renderer.domElement)

  const pit = createScene()
  const highlight = createHighlight(pit.config.blockSize)
  pit.scene.add(highlight.object)

  const cameras = new CameraRig()
  cameras.perspective.position.set(38, 32, 38)

  const controls = new OrbitControls(cameras.active, renderer.domElement)
  controls.enableDamping = true
  controls.target.set(0, 2, 0)
  controls.maxPolarAngle = Math.PI / 2 - 0.05

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()

  const stopListening = listenForClicks(renderer.domElement, (event) => {
    toNormalizedPointer(event, renderer.domElement, pointer)
    raycaster.setFromCamera(pointer, cameras.active)
    const block = pickBlock(raycaster, pit.terrain)
    highlight.show(block)
    options.onSelectBlock(block)
  })

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
      stopListening()
      resizeObserver.disconnect()
      controls.dispose()
      highlight.dispose()
      pit.dispose()
      renderer.dispose()
      container.removeChild(renderer.domElement)
    },
  }
}
