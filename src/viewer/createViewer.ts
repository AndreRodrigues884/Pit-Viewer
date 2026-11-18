import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CameraRig, type CameraMode } from '../camera/CameraRig'
import { Excavation } from '../game/Excavation'
import { createMeasurement } from '../measurement/createMeasurement'
import { pickSurfacePoint } from '../measurement/pickSurfacePoint'
import type { Block, PitConfig } from '../scene/blockModel'
import { createScene } from '../scene/createScene'
import type { TerrainView } from '../scene/terrain'
import { createHighlight } from '../selection/createHighlight'
import { pickBlock } from '../selection/pickBlock'
import { listenForClicks, toNormalizedPointer } from './pointer'

export type InteractionMode = 'select' | 'measure' | 'dig'

export interface DigResult {
  block: Block
  mined: boolean
  minedBlocks: Block[]
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
  setDigEnabled: (enabled: boolean) => void
  setShowMineable: (enabled: boolean) => void
  setTerrainView: (view: TerrainView) => void
  loadModel: (config: PitConfig) => void
  resetGame: () => void
  dispose: () => void
}

const CAMERA_OFFSET = new THREE.Vector3(0.75, 0.6, 0.75)

export function createViewer(
  container: HTMLElement,
  config: PitConfig,
  options: ViewerOptions,
): ViewerHandle {
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.localClippingEnabled = true
  container.appendChild(renderer.domElement)

  let pit = createScene(config)
  const highlight = createHighlight(config.blockSize)
  const measurement = createMeasurement(config.blockSize * 0.3)
  pit.scene.add(highlight.object, measurement.object)

  const cameras = new CameraRig()
  const controls = new OrbitControls(cameras.active, renderer.domElement)
  controls.enableDamping = true
  controls.maxPolarAngle = Math.PI / 2 - 0.05

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  let excavation = new Excavation(pit.blocks)
  let interactionMode: InteractionMode = 'select'
  let digEnabled = true
  let showMineable = true
  let shadows = true
  let terrainView: TerrainView = { visibleTypes: { soil: true, waste: true, ore: true }, section: 1 }

  const frameCamera = () => {
    const target = new THREE.Vector3(0, pit.config.pitBottomLevel * pit.config.blockSize, 0)
    cameras.frame(CAMERA_OFFSET.clone().multiplyScalar(pit.extent).add(target), target)
    controls.target.copy(target)
    controls.object = cameras.active
    controls.update()
  }

  const updateTint = () => {
    const active = interactionMode === 'dig' && digEnabled && showMineable
    pit.terrain.setTint(active ? (block) => excavation.canMine(block) : null)
  }

  const clearInteraction = () => {
    highlight.show(null)
    measurement.clear()
    options.onSelectBlock(null)
    options.onMeasure([])
  }

  const startGame = () => {
    excavation = new Excavation(pit.blocks)
    pit.terrain.reset()
    updateTint()
    options.onDig(null)
  }

  const handleSelect = () => {
    const block = pickBlock(raycaster, pit.terrain)
    highlight.show(block)
    options.onSelectBlock(block)
  }

  const handleMeasure = () => {
    const point = pickSurfacePoint(raycaster, pit.terrain, pit.ground)
    if (point) options.onMeasure(measurement.addPoint(point))
  }

  const handleDig = () => {
    if (!digEnabled) return
    const block = pickBlock(raycaster, pit.terrain)
    if (!block) return

    const mined = excavation.mine(block)
    if (mined) {
      pit.terrain.removeBlock(block)
      highlight.show(null)
      updateTint()
    } else {
      highlight.show(block, 'blocked')
    }
    options.onDig({ block, mined, minedBlocks: [...excavation.minedBlocks] })
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
  frameCamera()

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
      shadows = enabled
      pit.lights.directional.castShadow = enabled
    },
    setInteractionMode(mode) {
      if (mode === interactionMode) return
      interactionMode = mode
      clearInteraction()
      updateTint()
    },
    setDigEnabled(enabled) {
      digEnabled = enabled
      if (!enabled) highlight.show(null)
      updateTint()
    },
    setShowMineable(enabled) {
      showMineable = enabled
      updateTint()
    },
    setTerrainView(view) {
      terrainView = view
      pit.terrain.setView(view)
    },
    loadModel(nextConfig) {
      if (nextConfig === pit.config) return
      pit.scene.remove(highlight.object, measurement.object)
      pit.dispose()

      pit = createScene(nextConfig)
      pit.scene.add(highlight.object, measurement.object)
      pit.terrain.setView(terrainView)
      pit.lights.directional.castShadow = shadows

      clearInteraction()
      startGame()
      frameCamera()
    },
    resetGame() {
      highlight.show(null)
      startGame()
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
