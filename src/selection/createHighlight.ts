import * as THREE from 'three'
import type { Block } from '../scene/blockModel'

const HIGHLIGHT_COLOR = '#ffd84d'
const HIGHLIGHT_SCALE = 1.02

export interface Highlight {
  object: THREE.Group
  show: (block: Block | null) => void
  dispose: () => void
}

export function createHighlight(blockSize: number): Highlight {
  const side = blockSize * HIGHLIGHT_SCALE
  const geometry = new THREE.BoxGeometry(side, side, side)
  const edgesGeometry = new THREE.EdgesGeometry(geometry)

  const fillMaterial = new THREE.MeshBasicMaterial({
    color: HIGHLIGHT_COLOR,
    transparent: true,
    opacity: 0.45,
  })
  const edgeMaterial = new THREE.LineBasicMaterial({ color: HIGHLIGHT_COLOR })

  const object = new THREE.Group()
  object.add(new THREE.Mesh(geometry, fillMaterial), new THREE.LineSegments(edgesGeometry, edgeMaterial))
  object.visible = false

  const show = (block: Block | null) => {
    object.visible = block !== null
    if (block) object.position.copy(block.position)
  }

  const dispose = () => {
    geometry.dispose()
    edgesGeometry.dispose()
    fillMaterial.dispose()
    edgeMaterial.dispose()
  }

  return { object, show, dispose }
}
