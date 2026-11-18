import * as THREE from 'three'

const MEASURE_COLOR = '#4dd2ff'

export interface Measurement {
  object: THREE.Group
  addPoint: (point: THREE.Vector3) => THREE.Vector3[]
  clear: () => void
  dispose: () => void
}

export function createMeasurement(markerRadius: number): Measurement {
  const markerGeometry = new THREE.SphereGeometry(markerRadius, 16, 12)
  const markerMaterial = new THREE.MeshBasicMaterial({ color: MEASURE_COLOR })
  const markers = [
    new THREE.Mesh(markerGeometry, markerMaterial),
    new THREE.Mesh(markerGeometry, markerMaterial),
  ]

  const lineGeometry = new THREE.BufferGeometry()
  lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(6), 3))
  const lineMaterial = new THREE.LineBasicMaterial({ color: MEASURE_COLOR, depthTest: false })
  const line = new THREE.Line(lineGeometry, lineMaterial)
  line.renderOrder = 1
  line.frustumCulled = false

  const object = new THREE.Group()
  object.add(...markers, line)

  let points: THREE.Vector3[] = []

  const update = () => {
    markers.forEach((marker, index) => {
      const point = points[index]
      marker.visible = point !== undefined
      if (point) marker.position.copy(point)
    })

    line.visible = points.length === 2
    if (points.length === 2) {
      const positions = lineGeometry.getAttribute('position') as THREE.BufferAttribute
      positions.setXYZ(0, points[0].x, points[0].y, points[0].z)
      positions.setXYZ(1, points[1].x, points[1].y, points[1].z)
      positions.needsUpdate = true
    }
  }

  const addPoint = (point: THREE.Vector3) => {
    points = points.length === 2 ? [point.clone()] : [...points, point.clone()]
    update()
    return points
  }

  const clear = () => {
    points = []
    update()
  }

  const dispose = () => {
    markerGeometry.dispose()
    markerMaterial.dispose()
    lineGeometry.dispose()
    lineMaterial.dispose()
  }

  update()

  return { object, addPoint, clear, dispose }
}
