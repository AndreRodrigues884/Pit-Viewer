import * as THREE from 'three'
import type { Block } from '../scene/blockModel'

export type HighlightTone = 'select' | 'blocked'

const HIGHLIGHT_COLORS: Record<HighlightTone, string> = {
  select: '#ffd84d',
  blocked: '#ff4d4d',
}
const HIGHLIGHT_SCALE = 1.02

export interface Highlight {
  object: THREE.Group
  show: (block: Block | null, tone?: HighlightTone) => void
  dispose: () => void
}

export function createHighlight(blockSize: number): Highlight {
  const side = blockSize * HIGHLIGHT_SCALE
  const geometry = new THREE.BoxGeometry(side, side, side)
  const edgesGeometry = new THREE.EdgesGeometry(geometry)

  const fillMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.45 })
  const edgeMaterial = new THREE.LineBasicMaterial()

  const object = new THREE.Group()
  object.add(new THREE.Mesh(geometry, fillMaterial), new THREE.LineSegments(edgesGeometry, edgeMaterial))
  object.visible = false

  const show = (block: Block | null, tone: HighlightTone = 'select') => {
    object.visible = block !== null
    if (!block) return
    object.position.copy(block.position)
    fillMaterial.color.set(HIGHLIGHT_COLORS[tone])
    edgeMaterial.color.set(HIGHLIGHT_COLORS[tone])
  }

  const dispose = () => {
    geometry.dispose()
    edgesGeometry.dispose()
    fillMaterial.dispose()
    edgeMaterial.dispose()
  }

  return { object, show, dispose }
}
