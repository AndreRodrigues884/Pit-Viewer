export interface Point3 {
  x: number
  y: number
  z: number
}

export function distance(a: Point3, b: Point3): number {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const dz = b.z - a.z
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}
