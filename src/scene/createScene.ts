import * as THREE from 'three'
import { DEFAULT_PIT, generateBlocks, type PitConfig } from './blockModel'
import { createGround } from './ground'
import { createLights, type Lights } from './lights'
import { createTerrain, type Terrain } from './terrain'

export interface PitScene {
  config: PitConfig
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

  const terrain = createTerrain(generateBlocks(config), config.blockSize)
  const ground = createGround(extent * 3)
  const lights = createLights(extent)

  const axes = new THREE.AxesHelper(8)
  axes.position.set(-extent / 2 - 2, 0, extent / 2 + 2)

  scene.add(terrain.group, ground, axes, lights.ambient, lights.directional)

  const dispose = () => {
    terrain.dispose()
    ground.geometry.dispose()
    ;(ground.material as THREE.Material).dispose()
    axes.dispose()
    lights.directional.dispose()
  }

  return { config, scene, terrain, ground, lights, dispose }
}
