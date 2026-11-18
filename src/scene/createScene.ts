import * as THREE from 'three'
import { DEFAULT_PIT, generateBlocks, type Block, type PitConfig } from './blockModel'
import { createGround } from './ground'
import { createLights, type Lights } from './lights'
import { createTerrain, type Terrain } from './terrain'

export interface PitScene {
  config: PitConfig
  extent: number
  blocks: Block[]
  scene: THREE.Scene
  terrain: Terrain
  ground: THREE.Mesh
  lights: Lights
  dispose: () => void
}

export function createScene(): PitScene {
  const config = DEFAULT_PIT
  const extent = config.size * config.blockSize

  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#1b1f24')

  const blocks = generateBlocks(config)
  const terrain = createTerrain(blocks, config.blockSize)
  const ground = createGround(extent * 3)
  const lights = createLights(extent)

  const axesOffset = extent / 2 + config.blockSize * 2
  const axes = new THREE.AxesHelper(extent * 0.2)
  axes.position.set(-axesOffset, 0, axesOffset)

  scene.add(terrain.group, ground, axes, lights.ambient, lights.directional)

  const dispose = () => {
    terrain.dispose()
    ground.geometry.dispose()
    ;(ground.material as THREE.Material).dispose()
    axes.dispose()
    lights.directional.dispose()
  }

  return { config, extent, blocks, scene, terrain, ground, lights, dispose }
}
