import * as THREE from 'three'
import type { Block } from './blockModel'
import { BLOCK_COLORS, BLOCK_TYPES, type BlockType } from './blockTypes'

const BLOCK_FILL = 0.96
const FULL_TINT = new THREE.Color(1, 1, 1)
const DIM_TINT = new THREE.Color(0.35, 0.35, 0.35)

export interface Terrain {
  group: THREE.Group
  meshes: THREE.InstancedMesh[]
  getBlock: (mesh: THREE.Object3D, instanceId: number) => Block | undefined
  removeBlock: (block: Block) => void
  reset: () => void
  setTint: (isBright: ((block: Block) => boolean) | null) => void
  dispose: () => void
}

export function createTerrain(blocks: Block[], blockSize: number): Terrain {
  const side = blockSize * BLOCK_FILL
  const geometry = new THREE.BoxGeometry(side, side, side)
  const group = new THREE.Group()
  const matrix = new THREE.Matrix4()
  const color = new THREE.Color()

  const meshByType = new Map<BlockType, THREE.InstancedMesh>()
  const blocksByMesh = new Map<THREE.Object3D, Block[]>()
  const instanceIndex = new Map<Block, number>()

  const meshes = BLOCK_TYPES.map((type) => {
    const capacity = blocks.filter((block) => block.type === type).length
    const material = new THREE.MeshStandardMaterial({ color: BLOCK_COLORS[type], roughness: 0.9 })
    const mesh = new THREE.InstancedMesh(geometry, material, capacity)
    mesh.castShadow = true
    mesh.receiveShadow = true
    meshByType.set(type, mesh)
    group.add(mesh)
    return mesh
  })

  const reset = () => {
    instanceIndex.clear()
    for (const [type, mesh] of meshByType) {
      const typeBlocks = blocks.filter((block) => block.type === type)
      typeBlocks.forEach((block, index) => {
        matrix.makeTranslation(block.position)
        mesh.setMatrixAt(index, matrix)
        instanceIndex.set(block, index)
      })
      blocksByMesh.set(mesh, typeBlocks)
      mesh.count = typeBlocks.length
      mesh.instanceMatrix.needsUpdate = true
    }
  }

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
    if (mesh.instanceColor) {
      mesh.getColorAt(lastIndex, color)
      mesh.setColorAt(index, color)
    }
    typeBlocks[index] = lastBlock
    instanceIndex.set(lastBlock, index)

    typeBlocks.pop()
    instanceIndex.delete(block)
    mesh.count = typeBlocks.length
    mesh.instanceMatrix.needsUpdate = true
  }

  const setTint = (isBright: ((block: Block) => boolean) | null) => {
    for (const mesh of meshes) {
      blocksByMesh.get(mesh)!.forEach((block, index) => {
        mesh.setColorAt(index, !isBright || isBright(block) ? FULL_TINT : DIM_TINT)
      })
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    }
  }

  const dispose = () => {
    geometry.dispose()
    meshes.forEach((mesh) => {
      ;(mesh.material as THREE.Material).dispose()
      mesh.dispose()
    })
  }

  reset()

  return { group, meshes, getBlock, removeBlock, reset, setTint, dispose }
}
