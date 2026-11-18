import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CameraRig, type CameraMode } from '../camera/CameraRig'
import { Excavation } from '../game/Excavation'
import { createMeasurement } from '../measurement/createMeasurement'
import { pickSurfacePoint } from '../measurement/pickSurfacePoint'
import type { Block } from '../scene/blockModel'
import { createScene } from '../scene/createScene'
import { createHighlight } from '../selection/createHighlight'
import { pickBlock } from '../selection/pickBlock'
import { listenForClicks, toNormalizedPointer } from './pointer'

export type InteractionMode = 'select' | 'measure' | 'dig'

export interface DigResult {
  block: Block
  mined: boolean
  minedCount: number
}

export interface ViewerOptions {
  onSelectBlock: (block: Block | null) => void
  onMeasure: (points: THREE.Vector3[]) => void
  onDig: (result: DigResult | null) => void
}

export interface ViewerHandle {
  setCameraMode: (mode: CameraMode) => void
  setShadows: (enabled: boolean) => void
  setInteractionMode: (mode: InteractionMode) => void
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
  const measurement = createMeasurement(pit.config.blockSize * 0.3)
  pit.scene.add(highlight.object, measurement.object)

  const cameras = new CameraRig()
  cameras.perspective.position.set(0.95, 0.8, 0.95).multiplyScalar(pit.extent)

  const controls = new OrbitControls(cameras.active, renderer.domElement)
  controls.enableDamping = true
  controls.target.set(0, pit.config.blockSize * 2, 0)
  controls.maxPolarAngle = Math.PI / 2 - 0.05

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  const measureTargets = [...pit.terrain.meshes, pit.ground]
  const excavation = new Excavation(pit.blocks)
  let interactionMode: InteractionMode = 'select'

  const handleSelect = () => {
    const block = pickBlock(raycaster, pit.terrain)
    highlight.show(block)
    options.onSelectBlock(block)
  }

  const handleMeasure = () => {
    const point = pickSurfacePoint(raycaster, measureTargets)
    if (point) options.onMeasure(measurement.addPoint(point))
  }

  const handleDig = () => {
    const block = pickBlock(raycaster, pit.terrain)
    if (!block) return

    const mined = excavation.mine(block)
    if (mined) {
      pit.terrain.removeBlock(block)
      highlight.show(null)
    } else {
      highlight.show(block, 'blocked')
    }
    options.onDig({ block, mined, minedCount: excavation.minedBlocks.length })
  }

  const clickHandlers: Record<InteractionMode, () => void> = {
    select: handleSelect,
    measure: handleMeasure,
    dig: handleDig,
  }

  const stopListening = listenForClicks(renderer.domElement, (event) => {
    toNormalizedPointer(event, renderer.domElement, pointer)
    raycaster.setFromCamera(pointer, cameras.active)
    clickHandlers[interactionMode]()
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
    setInteractionMode(mode) {
      if (mode === interactionMode) return
      interactionMode = mode
      highlight.show(null)
      measurement.clear()
      options.onSelectBlock(null)
      options.onMeasure([])
      options.onDig(null)
    },
    dispose() {
      cancelAnimationFrame(frameId)
      stopListening()
      resizeObserver.disconnect()
      controls.dispose()
      highlight.dispose()
      measurement.dispose()
      pit.dispose()
      renderer.dispose()
      container.removeChild(renderer.domElement)
    },
  }
}
