import * as THREE from 'three'
import type { Block } from './blockModel'
import { BLOCK_COLORS, BLOCK_TYPES } from './blockTypes'

const BLOCK_FILL = 0.96

export interface Terrain {
  group: THREE.Group
  meshes: THREE.InstancedMesh[]
  dispose: () => void
}

export function createTerrain(blocks: Block[], blockSize: number): Terrain {
  const side = blockSize * BLOCK_FILL
  const geometry = new THREE.BoxGeometry(side, side, side)
  const group = new THREE.Group()
  const matrix = new THREE.Matrix4()

  const meshes = BLOCK_TYPES.map((type) => {
    const typeBlocks = blocks.filter((block) => block.type === type)
    const material = new THREE.MeshStandardMaterial({ color: BLOCK_COLORS[type], roughness: 0.9 })
    const mesh = new THREE.InstancedMesh(geometry, material, typeBlocks.length)

    typeBlocks.forEach((block, index) => {
      matrix.makeTranslation(block.position)
      mesh.setMatrixAt(index, matrix)
    })

    mesh.castShadow = true
    mesh.receiveShadow = true
    group.add(mesh)
    return mesh
  })

  const dispose = () => {
    geometry.dispose()
    meshes.forEach((mesh) => {
      ;(mesh.material as THREE.Material).dispose()
      mesh.dispose()
    })
  }

  return { group, meshes, dispose }
}
