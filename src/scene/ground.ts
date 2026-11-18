import * as THREE from 'three'

export function createGround(extent: number): THREE.Mesh {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(extent, extent),
    new THREE.MeshStandardMaterial({ color: '#3a4148', roughness: 1 }),
  )
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -0.01
  ground.receiveShadow = true
  return ground
}
