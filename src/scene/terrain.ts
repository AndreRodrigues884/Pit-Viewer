import * as THREE from 'three'
import type { Block } from './blockModel'
import { BLOCK_COLORS, BLOCK_TYPES, type BlockType } from './blockTypes'

const BLOCK_FILL = 0.96

export interface Terrain {
  group: THREE.Group
  meshes: THREE.InstancedMesh[]
  getBlock: (mesh: THREE.Object3D, instanceId: number) => Block | undefined
  removeBlock: (block: Block) => void
  dispose: () => void
}

export function createTerrain(blocks: Block[], blockSize: number): Terrain {
  const side = blockSize * BLOCK_FILL
  const geometry = new THREE.BoxGeometry(side, side, side)
  const group = new THREE.Group()
  const matrix = new THREE.Matrix4()
  const meshByType = new Map<BlockType, THREE.InstancedMesh>()
  const blocksByMesh = new Map<THREE.Object3D, Block[]>()
  const instanceIndex = new Map<Block, number>()

  const meshes = BLOCK_TYPES.map((type) => {
    const typeBlocks = blocks.filter((block) => block.type === type)
    const material = new THREE.MeshStandardMaterial({ color: BLOCK_COLORS[type], roughness: 0.9 })
    const mesh = new THREE.InstancedMesh(geometry, material, typeBlocks.length)

    typeBlocks.forEach((block, index) => {
      matrix.makeTranslation(block.position)
      mesh.setMatrixAt(index, matrix)
      instanceIndex.set(block, index)
    })

    mesh.castShadow = true
    mesh.receiveShadow = true
    meshByType.set(type, mesh)
    blocksByMesh.set(mesh, typeBlocks)
    group.add(mesh)
    return mesh
  })

  const getBlock = (mesh: THREE.Object3D, instanceId: number) =>
    blocksByMesh.get(mesh)?.[instanceId]

  const removeBlock = (block: Block) => {
    const mesh = meshByType.get(block.type)
    const index = instanceIndex.get(block)
    if (!mesh || index === undefined) return

    const typeBlocks = blocksByMesh.get(mesh)!
    const lastIndex = typeBlocks.length - 1
    const lastBlock = typeBlocks[lastIndex]

    mesh.getMatrixAt(lastIndex, matrix)
    mesh.setMatrixAt(index, matrix)
    typeBlocks[index] = lastBlock
    instanceIndex.set(lastBlock, index)

    typeBlocks.pop()
    instanceIndex.delete(block)
    mesh.count = typeBlocks.length
    mesh.instanceMatrix.needsUpdate = true
  }

  const dispose = () => {
    geometry.dispose()
    meshes.forEach((mesh) => {
      ;(mesh.material as THREE.Material).dispose()
      mesh.dispose()
    })
  }

  return { group, meshes, getBlock, removeBlock, dispose }
}
